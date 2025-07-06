
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib_prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const jobData = await req.json();
  try {
    const updatedJob = await prisma.job.update({
      where: { id: parseInt(params.id) },
      data: jobData,
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.job.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: 'Job deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
