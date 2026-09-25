import { NextResponse } from "next/server";
import { validateCoupon, CouponError } from "@/lib/coupons";

export async function POST(request) {
  const data = await request.json();
  if (!data.code) return NextResponse.json({ error: "Falta el código del cupón" }, { status: 400 });
  try {
    const coupon = await validateCoupon(data.code, data.cartCategoryIds || []);
    return NextResponse.json(coupon);
  } catch (err) {
    if (err instanceof CouponError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
