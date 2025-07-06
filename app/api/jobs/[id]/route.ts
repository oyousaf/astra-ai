import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const jobId = parseInt(params.id);
  const body = await req.json();

  const { method, ...jobData } = body;

  try {
    if (method === "UPDATE") {
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: jobData,
      });
      return NextResponse.json(updatedJob);
    }

    if (method === "DELETE") {
      await prisma.job.delete({
        where: { id: jobId },
      });
      return NextResponse.json({ message: "Job deleted" });
    }

    return NextResponse.json({ error: "Unsupported method" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
