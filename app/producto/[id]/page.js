import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import StoreHeader from "@/components/StoreHeader";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";

export const dynamic = "force-dynamic";

export default async function ProductoPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  });

  if (!product || !product.active) notFound();

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2">
          <ProductGallery images={product.images} alt={product.name} categorySlug={product.category?.slug} />
          <div>
            {product.category && <p className="text-xs uppercase tracking-wide text-black/50">{product.category.name}</p>}
            <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
            <p className="mt-2 text-xl font-semibold">{formatCurrency(product.price)}</p>
            {product.description && <p className="mt-4 text-black/60">{product.description}</p>}
            <AddToCartPanel product={product} />
          </div>
        </div>
      </main>
    </>
  );
}
