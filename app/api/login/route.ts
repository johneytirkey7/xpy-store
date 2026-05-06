import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Check karo ki is email ka koi account database mein hai ya nahi
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Bhai ye email register hi nahi hai. Pehle Signup karo!" }, 
        { status: 400 }
      );
    }

    // 2. Agar email hai, toh Password check karo
    // (bcrypt khud check karega ki normal password aur database ka secret code match karte hain ya nahi)
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Password galat hai bhai, dobara try karo!" }, 
        { status: 400 }
      );
    }

    // 3. Sab sahi hai toh Login Success (YAHAN ROLE ADD KIYA HAI 🔥)
    return NextResponse.json(
      { 
        message: "Login successful!", 
        user: { name: user.name, email: user.email, role: user.role } 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.log("Login Error:", error);
    return NextResponse.json(
      { error: "Kuch gadbad ho gayi backend mein." }, 
      { status: 500 }
    );
  }
}