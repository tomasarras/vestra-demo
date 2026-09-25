import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoreHeader from "@/components/StoreHeader";
import ProductCard from "@/components/ProductCard";

export default async function TiendaPage({ searchParams }) {
  const { categoria } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, category: categoria ? { slug: categoria } : undefined },
      include: { category: true, images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Tienda</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/tienda"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              !categoria ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
            }`}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/tienda?categoria=${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                categoria === c.slug ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="mt-10 text-sm text-black/40">No hay productos en esta categoría.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
