import { prisma } from "@/lib/prisma";

export class CouponError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const COUPON_INCLUDE = { categories: { include: { category: true } } };

// data: { code, discountPercent, appliesToAll, categoryIds, quantity (or null = ilimitado), expiresInDays (or null = indefinido) }
export function buildCouponCreateData(data) {
  const code = (data.code || "").trim().toUpperCase();
  if (!code) throw new CouponError("Falta el código del cupón", 400);

  const discountPercent = Number(data.discountPercent);
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
    throw new CouponError("El descuento debe ser un porcentaje entre 1 y 100", 400);
  }

  const appliesToAll = Boolean(data.appliesToAll);
  const categoryIds = appliesToAll ? [] : Array.isArray(data.categoryIds) ? data.categoryIds : [];
  if (!appliesToAll && categoryIds.length === 0) {
    throw new CouponError("Elegí al menos una categoría o marcá \"Todas\"", 400);
  }

  const quantity = data.quantity === null || data.quantity === "" || data.quantity === undefined
    ? null
    : Math.max(1, Math.trunc(Number(data.quantity)));

  const expiresAt = data.expiresInDays === null || data.expiresInDays === "" || data.expiresInDays === undefined
    ? null
    : new Date(Date.now() + Math.max(1, Math.trunc(Number(data.expiresInDays))) * 24 * 60 * 60 * 1000);

  return {
    code,
    discountPercent: Math.trunc(discountPercent),
    appliesToAll,
    quantity,
    remainingUses: quantity,
    expiresAt,
    categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
  };
}

export function serializeCoupon(coupon) {
  const now = new Date();
  const expired = Boolean(coupon.expiresAt && new Date(coupon.expiresAt) < now);
  const soldOut = coupon.remainingUses !== null && coupon.remainingUses <= 0;
  const status = !coupon.active ? "inactivo" : expired ? "vencido" : soldOut ? "agotado" : "activo";

  return {
    id: coupon.id,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    appliesToAll: coupon.appliesToAll,
    categoryIds: coupon.categories.map((c) => c.categoryId),
    categoryNames: coupon.categories.map((c) => c.category.name),
    quantity: coupon.quantity,
    remainingUses: coupon.remainingUses,
    expiresAt: coupon.expiresAt,
    active: coupon.active,
    status,
    createdAt: coupon.createdAt,
  };
}

// Read-only check used when the customer clicks "Aplicar" in the cart.
// Never decrements remainingUses — that only happens at checkout
// (redeemCoupon), so an abandoned cart doesn't burn a coupon slot.
export async function validateCoupon(code, cartCategoryIds) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: COUPON_INCLUDE,
  });

  if (!coupon || !coupon.active) {
    throw new CouponError("El cupón no existe", 404);
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new CouponError("El cupón venció", 400);
  }
  if (coupon.remainingUses !== null && coupon.remainingUses <= 0) {
    throw new CouponError("El cupón ya alcanzó su límite de usos", 400);
  }
  if (!coupon.appliesToAll) {
    const eligibleIds = new Set(coupon.categories.map((c) => c.categoryId));
    const hasEligibleItem = (cartCategoryIds || []).some((id) => eligibleIds.has(id));
    if (!hasEligibleItem) {
      throw new CouponError("El cupón no aplica a los productos de tu carrito", 400);
    }
  }

  return serializeCoupon(coupon);
}

// Re-validates everything server-side (never trusts client state) and
// decrements remainingUses atomically. Must be called inside the same
// prisma.$transaction as the order it belongs to.
export async function redeemCoupon(tx, code, cartCategoryIds) {
  const coupon = await tx.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: COUPON_INCLUDE,
  });

  if (!coupon || !coupon.active) {
    throw new CouponError("El cupón no existe", 404);
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new CouponError("El cupón venció", 400);
  }
  if (coupon.remainingUses !== null && coupon.remainingUses <= 0) {
    throw new CouponError("El cupón ya alcanzó su límite de usos", 400);
  }
  if (!coupon.appliesToAll) {
    const eligibleIds = new Set(coupon.categories.map((c) => c.categoryId));
    const hasEligibleItem = (cartCategoryIds || []).some((id) => eligibleIds.has(id));
    if (!hasEligibleItem) {
      throw new CouponError("El cupón no aplica a los productos de tu carrito", 400);
    }
  }

  if (coupon.remainingUses !== null) {
    await tx.coupon.update({
      where: { id: coupon.id },
      data: { remainingUses: { decrement: 1 } },
    });
  }

  return {
    discountPercent: coupon.discountPercent,
    appliesToAll: coupon.appliesToAll,
    eligibleCategoryIds: new Set(coupon.categories.map((c) => c.categoryId)),
  };
}
