import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct, validateProductInput, ProductError } from "@/lib/products";

const PRODUCT_INCLUDE = { category: true, images: true };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("categoria");
  const showAll = searchParams.get("all") === "true";

  const products = await prisma.product.findMany({
    where: {
      active: showAll ? undefined : true,
      category: categorySlug ? { slug: categorySlug } : undefined,
    },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(request) {
  const data = await request.json();
  try {
    const input = validateProductInput(data);
    const product = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        sizes: input.sizes,
        active: input.active,
        categoryId: input.categoryId,
        images: { create: input.images.map((url, order) => ({ url, order })) },
      },
      include: PRODUCT_INCLUDE,
    });
    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (err) {
    if (err instanceof ProductError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
