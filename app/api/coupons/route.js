import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCoupon, buildCouponCreateData, CouponError } from "@/lib/coupons";

const COUPON_INCLUDE = { categories: { include: { category: true } } };

export async function GET() {
  const coupons = await prisma.coupon.findMany({ include: COUPON_INCLUDE, orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons.map(serializeCoupon));
}

export async function POST(request) {
  const data = await request.json();
  try {
    const createData = buildCouponCreateData(data);
    const coupon = await prisma.coupon.create({ data: createData, include: COUPON_INCLUDE });
    return NextResponse.json(serializeCoupon(coupon), { status: 201 });
  } catch (err) {
    if (err instanceof CouponError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err.code === "P2002") return NextResponse.json({ error: "Ya existe un cupón con ese código" }, { status: 409 });
    throw err;
  }
}
