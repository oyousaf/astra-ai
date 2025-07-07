import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function extractJobId(req: NextRequest): number | null {
  const id = req.nextUrl.pathname.split("/").pop();
  return id ? Number(id) : null;
}

async function createSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function PUT(req: NextRequest) {
  const jobId = extractJobId(req);
  if (!jobId) {
    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  }

  const supabase = await createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  body.updatedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("Job")
    .update(body)
    .eq("id", jobId)
    .eq("userId", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const jobId = extractJobId(req);
  if (!jobId) {
    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  }

  const supabase = await createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("Job")
    .delete()
    .eq("id", jobId)
    .eq("userId", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
