// One-off data migration: Supabase (auth.users + public."Job") -> this project's Postgres.
// Usage: SUPABASE_DATABASE_URL=<old supabase connection string> node scripts/migrate-from-supabase.js
require("dotenv").config();
const { Client } = require("pg");
const prisma = require("../src/db");

const SOURCE_URL = process.env.SUPABASE_DATABASE_URL;

if (!SOURCE_URL) {
  console.error(
    "Set SUPABASE_DATABASE_URL to the old Supabase Postgres connection string first."
  );
  process.exit(1);
}

async function main() {
  const source = new Client({
    connectionString: SOURCE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await source.connect();

  console.log("Fetching users from Supabase auth.users...");
  const { rows: authUsers } = await source.query(
    `select id, email, encrypted_password from auth.users where email is not null`
  );

  const idMap = new Map(); // old Supabase uuid -> new integer User.id

  for (const u of authUsers) {
    const email = u.email.toLowerCase();

    if (!u.encrypted_password) {
      console.warn(`Skipping ${email} - no password hash (OAuth-only account?)`);
      continue;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      idMap.set(u.id, existing.id);
      console.log(`${email} already migrated -> id ${existing.id}`);
      continue;
    }

    const created = await prisma.user.create({
      data: { email, passwordHash: u.encrypted_password },
    });
    idMap.set(u.id, created.id);
    console.log(`Migrated user ${email} -> id ${created.id}`);
  }

  console.log('Fetching jobs from Supabase public."Job"...');
  const { rows: jobs } = await source.query(`select * from public."Job"`);

  let migrated = 0;
  let skipped = 0;

  for (const job of jobs) {
    const newUserId = idMap.get(job.userId);
    if (!newUserId) {
      console.warn(`Skipping job ${job.id} (${job.title}) - no migrated user for ${job.userId}`);
      skipped++;
      continue;
    }

    await prisma.job.create({
      data: {
        title: job.title,
        company: job.company,
        status: job.status,
        notes: job.notes,
        appliedDate: job.appliedDate ? new Date(job.appliedDate) : new Date(),
        userId: newUserId,
      },
    });
    migrated++;
  }

  console.log(
    `Done. ${idMap.size} users migrated, ${migrated} jobs migrated, ${skipped} jobs skipped.`
  );

  await source.end();
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
