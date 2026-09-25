"use client";

import { useState } from "react";
import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";

export default function ProductGallery({ images, alt, categorySlug }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/5">
        {active ? (
          <Image src={active.url} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
        ) : (
          <ProductImagePlaceholder categorySlug={categorySlug} className="h-full w-full" />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border ${
                index === activeIndex ? "border-black" : "border-black/10"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
