"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes?.[0] || null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-6 space-y-5">
      {product.sizes?.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Talle</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  size === s ? "border-black bg-black text-white" : "border-black/15 text-black/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium">Cantidad</p>
        <div className="flex w-fit items-center rounded-full border border-black/15">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5">
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
        >
          {added ? "¡Agregado!" : "Agregar al carrito"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/carrito");
          }}
          className="rounded-full border border-black px-6 py-3 text-sm font-semibold hover:bg-black/5"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
