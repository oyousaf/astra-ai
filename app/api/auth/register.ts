import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({ data: { email, password } });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
