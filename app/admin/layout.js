"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Shirt, Tag, LogOut } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";

const NAV = [
  { href: "/admin/categorias", label: "Categorías", icon: LayoutGrid },
  { href: "/admin/productos", label: "Productos", icon: Shirt },
  { href: "/admin/cupones", label: "Cupones", icon: Tag },
];

export default function AdminLayout({ children }) {
  const { isAdmin, loaded, exitAdmin } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !isAdmin) router.replace("/");
  }, [loaded, isAdmin, router]);

  if (!loaded || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-black/40">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="text-lg font-bold">
            Vestra <span className="font-normal text-black/50">admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                  pathname.startsWith(href) ? "bg-black text-white" : "hover:bg-black/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={exitAdmin}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-black/60 hover:bg-black/5"
            >
              <LogOut size={16} />
              Salir
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
