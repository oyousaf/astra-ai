import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};

export async function PUT(req: NextRequest, context: Context) {
  const jobData = await req.json();
  const jobId = parseInt(context.params.id);
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: jobData,
    });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const jobId = parseInt(context.params.id);
  try {
    await prisma.job.delete({ where: { id: jobId } });
    return NextResponse.json({ message: "Job deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
