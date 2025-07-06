import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;
  const jobData = await req.json();

  try {
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
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

export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  try {
    await prisma.job.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Job deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
