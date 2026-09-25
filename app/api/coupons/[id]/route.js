import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  const coupon = await prisma.coupon.update({ where: { id }, data: { active: Boolean(data.active) } });
  return NextResponse.json({ id: coupon.id, active: coupon.active });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
