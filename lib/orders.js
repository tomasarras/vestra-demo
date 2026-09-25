import { prisma } from "@/lib/prisma";
import { redeemCoupon, CouponError } from "@/lib/coupons";

export class OrderError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeOrder(order) {
  return {
    id: order.id,
    couponCode: order.couponCode,
    discountAmount: order.discountAmount,
    subtotal: order.subtotal,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      size: item.size,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
  };
}

// Creates a simulated order: re-fetches current prices server-side (never
// trusts client-sent prices), applies the coupon discount only to items
// from eligible categories, and — if a coupon was used — decrements its
// remainingUses in the same transaction (see lib/coupons.js redeemCoupon).
export async function createOrder({ items, couponCode }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderError("El carrito está vacío", 400);
  }

  return prisma.$transaction(async (tx) => {
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map((p) => [p.id, p]));

    const orderItems = items.map((item) => {
      const product = productById.get(item.productId);
      if (!product) throw new OrderError("Un producto del carrito ya no existe", 400);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        productId: product.id,
        productName: product.name,
        size: item.size || null,
        unitPrice: product.price,
        quantity,
        categoryId: product.categoryId,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    let discountAmount = 0;
    let appliedCode = null;

    if (couponCode) {
      const cartCategoryIds = orderItems.map((i) => i.categoryId).filter(Boolean);
      let coupon;
      try {
        coupon = await redeemCoupon(tx, couponCode, cartCategoryIds);
      } catch (err) {
        if (err instanceof CouponError) throw new OrderError(err.message, err.status);
        throw err;
      }
      const eligibleSubtotal = coupon.appliesToAll
        ? subtotal
        : orderItems.reduce(
            (sum, i) => sum + (coupon.eligibleCategoryIds.has(i.categoryId) ? i.unitPrice * i.quantity : 0),
            0,
          );
      discountAmount = Math.round((eligibleSubtotal * coupon.discountPercent) / 100);
      appliedCode = couponCode.trim().toUpperCase();
    }

    const total = Math.max(0, subtotal - discountAmount);

    const order = await tx.order.create({
      data: {
        couponCode: appliedCode,
        discountAmount,
        subtotal,
        total,
        items: {
          create: orderItems.map(({ categoryId: _categoryId, ...item }) => item),
        },
      },
      include: { items: true },
    });

    return serializeOrder(order);
  });
}
