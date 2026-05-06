import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔥 1. Products dikhane ke liye (GET)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' } // Naya product sabse pehle dikhega
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Database se products laane mein error:", error);
    return NextResponse.json([]); 
  }
}

// 🔥 2. Naya Product Add karne ke liye (POST) - Ye hum bhool gaye the!
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, description, imageUrl } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Product create karne mein error:", error);
    return NextResponse.json({ error: "Product save nahi hua database mein" }, { status: 500 });
  }
}