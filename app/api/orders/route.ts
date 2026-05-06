import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔥 1. Saare orders Admin ko dikhane ke liye (GET)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { id: 'desc' } // Sabse naya order sabse upar dikhega
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Orders lane mein error" }, { status: 500 });
  }
}

// 🔥 2. Naya order save karne ke liye (POST) - Ye humara purana wala hi hai
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, address, city, pinCode, totalAmount, items } = body;

    if (!fullName || !address || !city || !pinCode || !items) {
      return NextResponse.json({ error: "Bhai poori details nahi aayi!" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        fullName,
        email,
        address,
        city,
        pinCode,
        totalAmount: parseFloat(totalAmount),
        items, 
      },
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json({ error: "Order database mein save nahi hua" }, { status: 500 });
  }
}

// 🔥 3. Order ka Status update karne ke liye (PATCH)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Status update nahi hua" }, { status: 500 });
  }
}