import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Saare users ko lane ke liye (Password hide karke safe tareeke se)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Users lane mein error" }, { status: 500 });
  }
}

// 2. User ka Role change karne ke liye (User <-> Admin)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, role } = body;
    
    await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Role update nahi hua" }, { status: 500 });
  }
}