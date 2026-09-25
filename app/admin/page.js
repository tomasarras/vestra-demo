"use client";

import Link from "next/link";
import { LayoutGrid, Shirt, Tag } from "lucide-react";

const CARDS = [
  { href: "/admin/categorias", label: "Categorías", description: "Crear y organizar las categorías de ropa", icon: LayoutGrid },
  { href: "/admin/productos", label: "Productos", description: "Cargar ropa, precios, talles e imágenes", icon: Shirt },
  { href: "/admin/cupones", label: "Cupones", description: "Códigos de descuento con límite y vencimiento", icon: Tag },
];

export default function AdminPanelPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Panel</h1>
      <p className="mt-1 text-sm text-black/50">Elegí qué querés administrar.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
              <Icon size={20} />
            </span>
            <span className="font-semibold">{label}</span>
            <span className="text-sm text-black/50">{description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
