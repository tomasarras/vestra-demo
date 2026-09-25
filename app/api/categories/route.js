import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCategory, serializeCategory, CategoryError } from "@/lib/categories";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories.map(serializeCategory));
}

export async function POST(request) {
  const data = await request.json();
  try {
    const category = await createCategory(data.name);
    return NextResponse.json(serializeCategory(category), { status: 201 });
  } catch (err) {
    if (err instanceof CategoryError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
