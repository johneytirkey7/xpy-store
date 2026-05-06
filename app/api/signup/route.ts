import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Frontend se aane wala data (Name, Email, Password) lo
    const body = await req.json();
    const { name, email, password } = body;

    // 2. Check karo ki is email se pehle koi account toh nahi hai
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ye email pehle se use ho chuka hai!" }, 
        { status: 400 }
      );
    }

    // 3. Password ko secret code (Hash) mein badlo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Data ko MySQL Database mein save karo
    const newUser = await prisma.user.create({
      data: {
        name: name || "XPY User",
        email: email,
        password: hashedPassword,
      }
    });

    return NextResponse.json(
      { message: "Account successfully ban gaya!", user: newUser }, 
      { status: 201 }
    );

  } catch (error) {
    console.log("Signup Error:", error);
    return NextResponse.json(
      { error: "Kuch gadbad ho gayi, baad mein try karein." }, 
      { status: 500 }
    );
  }
}