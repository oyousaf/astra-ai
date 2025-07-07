import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const extractJobId = (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop();
  return id ? Number(id) : null;
};

const getSupabase = async () => {
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
};

const getUserOrThrow = async (
  supabase: ReturnType<typeof createServerClient>
) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user;
};

export async function PUT(req: NextRequest) {
  try {
    const jobId = extractJobId(req);
    if (!jobId) throw new Error("Invalid job ID");

    const supabase = await getSupabase();
    const user = await getUserOrThrow(supabase);

    const body = { ...(await req.json()), updatedAt: new Date().toISOString() };

    const { data, error } = await supabase
      .from("Job")
      .update(body)
      .eq("id", jobId)
      .eq("userId", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data }, { status: 200 });
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const jobId = extractJobId(req);
    if (!jobId) throw new Error("Invalid job ID");

    const supabase = await getSupabase();
    const user = await getUserOrThrow(supabase);

    const { error } = await supabase
      .from("Job")
      .delete()
      .eq("id", jobId)
      .eq("userId", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
