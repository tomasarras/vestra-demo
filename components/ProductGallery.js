"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";

export default function ProductGallery({ images, alt, categorySlug }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex];

  const goTo = (index) => setActiveIndex((index + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") goTo(activeIndex - 1);
      if (event.key === "ArrowRight") goTo(activeIndex + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, activeIndex]);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/5">
        {active ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 h-full w-full cursor-zoom-in"
          >
            <Image src={active.url} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain" />
          </button>
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

      {lightboxOpen && active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-4"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          <div
            className="relative h-[70vh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={active.url} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-4"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
