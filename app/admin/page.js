"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Shirt, Tag, ShieldCheck, RotateCcw, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";

const CARDS = [
  { href: "/admin/categorias", label: "Categorías", description: "Crear y organizar las categorías de ropa", icon: LayoutGrid },
  { href: "/admin/productos", label: "Productos", description: "Cargar ropa, precios, talles e imágenes", icon: Shirt },
  { href: "/admin/cupones", label: "Cupones", description: "Códigos de descuento con límite y vencimiento", icon: Tag },
];

export default function AdminEntryPage() {
  const { isAdmin, loaded, enterAdmin } = useAdmin();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function handleReset() {
    setResetting(true);
    setResetMessage("");
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo restablecer la demo");
      setResetMessage("Demo restablecida — todo volvió al estado inicial.");
    } catch (err) {
      setResetMessage(err.message);
    } finally {
      setResetting(false);
      setConfirmingReset(false);
    }
  }

  if (!loaded) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
          <ShieldCheck size={26} />
        </span>
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <p className="max-w-sm text-sm text-black/50">
          Es un proyecto de portfolio: no hay contraseñas reales. Entrás directo a la vista de administrador.
        </p>
        <button
          type="button"
          onClick={enterAdmin}
          className="mt-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/80"
        >
          Entrar como administrador
        </button>
        <Link href="/" className="text-sm text-black/50 underline underline-offset-2">
          Volver a la tienda
        </Link>
      </div>
    );
  }

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

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {!confirmingReset ? (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black/60 hover:bg-black/5"
          >
            <RotateCcw size={16} />
            Restablecer demo
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span>¿Borrar todo y volver al estado inicial?</span>
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {resetting && <Loader2 size={12} className="animate-spin" />}
              Sí, restablecer
            </button>
            <button
              type="button"
              onClick={() => setConfirmingReset(false)}
              disabled={resetting}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      {resetMessage && <p className="mt-3 text-sm text-black/50">{resetMessage}</p>}
    </div>
  );
}
