import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const jobData = await req.json();
  try {
    const job = await prisma.job.update({
      where: { id: parseInt(params.id) },
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.job.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Job deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
