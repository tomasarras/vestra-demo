import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoreHeader from "@/components/StoreHeader";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <StoreHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Vestra</h1>
            <p className="mt-4 text-lg text-black/60">Moda simple, todos los días.</p>
            <Link
              href="/tienda"
              className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
            >
              Ver la tienda
            </Link>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Quiénes somos</h2>
            <p className="mt-4 text-lg leading-relaxed text-black/70">
              Vestra nació de una idea simple: la ropa de todos los días no debería complicarte la vida. Diseñamos
              prendas básicas y versátiles, pensadas para durar, con materiales de calidad y precios honestos. Nada
              de esto es real — Vestra es un proyecto de portfolio, una tienda ficticia armada para mostrar cómo
              construiría una experiencia de compra completa: catálogo, carrito, cupones y un panel de
              administración, de punta a punta.
            </p>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="text-lg font-semibold">Categorías</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/tienda?categoria=${c.slug}`}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:border-black"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Destacados</h2>
              <Link href="/tienda" className="text-sm font-medium text-accent hover:underline">
                Ver todo
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-black/10 py-8 text-center text-xs text-black/40">
        Vestra — proyecto de portfolio. <Link href="/" className="underline">Cambiar de rol</Link>
      </footer>
    </>
  );
}
