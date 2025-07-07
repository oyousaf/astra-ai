import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("Job")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobs: data }, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({
    cookies: async () => await cookies(),
  });

  const body = await req.json();
  const { title, company, status, appliedDate, notes } = body;

  const now = new Date().toISOString();

  // ✅ Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data[0] }, { status: 200 });
}
