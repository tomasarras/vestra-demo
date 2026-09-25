import Link from "next/link";
import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { formatCurrency } from "@/lib/format";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <ProductImagePlaceholder categorySlug={product.category?.slug} className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category && <span className="text-xs uppercase tracking-wide text-black/50">{product.category.name}</span>}
        <span className="font-medium leading-snug">{product.name}</span>
        <span className="mt-auto pt-2 font-semibold">{formatCurrency(product.price)}</span>
      </div>
    </Link>
  );
}
