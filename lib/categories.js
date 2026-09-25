import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

export class CategoryError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function serializeCategory(category) {
  return { id: category.id, name: category.name, slug: category.slug };
}

export async function createCategory(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new CategoryError("Falta el nombre de la categoría", 400);
  const slug = slugify(trimmed);
  const existing = await prisma.category.findFirst({ where: { OR: [{ name: trimmed }, { slug }] } });
  if (existing) throw new CategoryError("Ya existe una categoría con ese nombre", 409);
  return prisma.category.create({ data: { name: trimmed, slug } });
}
