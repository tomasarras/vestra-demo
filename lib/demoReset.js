import { prisma } from "@/lib/prisma";
import { CATEGORIES, PRODUCTS, COUPONS } from "@/lib/demoData.mjs";

// Botón "Restablecer demo": borra todo (transaccional, catálogo y cupones)
// y vuelve a sembrar el catálogo base, para que cualquiera pueda romper la
// demo probando el flujo de compra/cupones y volver a un estado conocido.
export async function resetDemoData() {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.couponCategory.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  const categoryBySlug = {};
  for (const c of CATEGORIES) {
    categoryBySlug[c.slug] = await prisma.category.create({ data: { name: c.name, slug: c.slug } });
  }

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        sizes: p.sizes,
        categoryId: categoryBySlug[p.categorySlug]?.id,
      },
    });
  }

  for (const c of COUPONS) {
    await prisma.coupon.create({
      data: {
        code: c.code,
        discountPercent: c.discountPercent,
        appliesToAll: c.appliesToAll,
        quantity: c.quantity,
        remainingUses: c.quantity,
        expiresAt: c.expiresInDays ? new Date(Date.now() + c.expiresInDays * 24 * 60 * 60 * 1000) : null,
        categories: c.appliesToAll
          ? undefined
          : { create: (c.categorySlugs || []).map((slug) => ({ categoryId: categoryBySlug[slug]?.id })) },
      },
    });
  }
}
