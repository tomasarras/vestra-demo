import { prisma } from "@/lib/prisma";

export class ProductError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    sizes: product.sizes,
    active: product.active,
    categoryId: product.categoryId,
    category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : null,
    images: (product.images || [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((img) => ({ id: img.id, url: img.url })),
    createdAt: product.createdAt,
  };
}

export function validateProductInput(data) {
  const name = (data.name || "").trim();
  if (!name) throw new ProductError("Falta el nombre del producto", 400);
  const price = Number(data.price);
  if (!Number.isFinite(price) || price < 0) throw new ProductError("El precio no es válido", 400);
  const sizes = Array.isArray(data.sizes) ? data.sizes : [];
  const images = Array.isArray(data.images) ? data.images : [];
  return {
    name,
    description: data.description ? String(data.description).trim() : null,
    price: Math.round(price),
    sizes,
    active: data.active !== false,
    categoryId: data.categoryId || null,
    images,
  };
}
