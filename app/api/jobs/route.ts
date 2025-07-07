import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const getSupabase = (req: NextRequest) =>
  createServerClient(
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

const getUserOrThrow = async (supabase: ReturnType<typeof getSupabase>) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user;
};

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabase(req);
    const user = await getUserOrThrow(supabase);

    const { data, error } = await supabase
      .from("Job")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ jobs: data }, { status: 200 });
  } catch (err: any) {
    const msg = err.message === "Unauthorized" ? "Unauthorized" : err.message;
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase(req);
    const user = await getUserOrThrow(supabase);
    const body = await req.json();

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("Job")
      .insert([{ ...body, userId: user.id, createdAt: now, updatedAt: now }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data }, { status: 200 });
  } catch (err: any) {
    const msg = err.message === "Unauthorized" ? "Unauthorized" : err.message;
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
