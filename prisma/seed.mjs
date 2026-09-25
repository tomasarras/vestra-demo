import { PrismaClient } from "@prisma/client";
import { CATEGORIES, PRODUCTS, COUPONS } from "../lib/demoData.mjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  const categoryBySlug = {};
  for (const c of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug },
    });
    categoryBySlug[c.slug] = category;
  }

  console.log("Seeding products...");
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) continue;
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

  console.log("Seeding coupons...");
  for (const c of COUPONS) {
    const existing = await prisma.coupon.findUnique({ where: { code: c.code } });
    if (existing) continue;
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

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
