import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

async function createSupabaseClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseClient(req);

  const { data, error } = await supabase
    .from("Job")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobs: data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseClient(req);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, company, status, appliedDate, notes } = body;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("Job")
    .insert([
      {
        title,
        company,
        status,
        appliedDate,
        notes,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data }, { status: 200 });
}
