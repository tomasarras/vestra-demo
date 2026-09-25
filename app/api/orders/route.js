import { NextResponse } from "next/server";
import { createOrder, OrderError } from "@/lib/orders";

export async function POST(request) {
  const data = await request.json();
  try {
    const order = await createOrder({ items: data.items, couponCode: data.couponCode || null });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
