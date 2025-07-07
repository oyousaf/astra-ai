import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getJobIdFromParams(req: NextRequest): number {
  const idStr = req.nextUrl.pathname.split("/").pop();
  return idStr ? parseInt(idStr) : NaN;
}

export async function PUT(req: NextRequest) {
  const jobId = getJobIdFromParams(req);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isNaN(jobId)) {
    return NextResponse.json(
      { error: "Unauthorized or invalid ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  body.updatedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("Job")
    .update(body)
    .eq("id", jobId)
    .eq("userId", user.id)
    .select();

  if (error || !data.length) {
    return NextResponse.json(
      { error: error?.message || "Update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ job: data[0] }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const jobId = getJobIdFromParams(req);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isNaN(jobId)) {
    return NextResponse.json(
      { error: "Unauthorized or invalid ID" },
      { status: 400 }
    );
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
