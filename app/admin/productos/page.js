"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products?all=true");
    setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
        {loading && <p className="p-4 text-sm text-black/40">Cargando…</p>}
        {!loading && products.length === 0 && <p className="p-4 text-sm text-black/40">Todavía no hay productos.</p>}
        <ul className="divide-y divide-black/10">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5">
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt="" fill className="object-cover" />
                ) : (
                  <ProductImagePlaceholder categorySlug={p.category?.slug} className="h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-sm text-black/50">
                  {p.category?.name || "Sin categoría"} · {formatCurrency(p.price)}
                </p>
              </div>
              <Link href={`/admin/productos/${p.id}`} className="text-sm font-semibold text-black/70 hover:underline">
                Editar
              </Link>
              <button type="button" onClick={() => handleDelete(p.id)} className="text-black/40 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
