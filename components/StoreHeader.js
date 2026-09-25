"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function StoreHeader() {
  const { itemCount } = useCart() || { itemCount: 0 };

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/inicio" className="text-xl font-bold tracking-tight">
          Vestra
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/inicio" className="hidden hover:text-accent sm:inline">
            Inicio
          </Link>
          <Link href="/tienda" className="hover:text-accent">
            Tienda
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-1 hover:text-accent">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
