import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/categories";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  const name = (data.name || "").trim();
  if (!name) return NextResponse.json({ error: "Falta el nombre de la categoría" }, { status: 400 });
  const category = await prisma.category.update({ where: { id }, data: { name } });
  return NextResponse.json(serializeCategory(category));
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
