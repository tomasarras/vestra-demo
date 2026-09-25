"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";

const STATUS_STYLES = {
  activo: "bg-green-100 text-green-700",
  agotado: "bg-amber-100 text-amber-700",
  vencido: "bg-black/10 text-black/50",
  inactivo: "bg-black/10 text-black/50",
};

export default function CuponesPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/coupons");
    setCoupons(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este cupón?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cupones</h1>
        <Link
          href="/admin/cupones/nuevo"
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          Nuevo cupón
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white">
        {loading && <p className="p-4 text-sm text-black/40">Cargando…</p>}
        {!loading && coupons.length === 0 && <p className="p-4 text-sm text-black/40">Todavía no hay cupones.</p>}
        {coupons.length > 0 && (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/10 text-black/50">
              <tr>
                <th className="p-3 font-medium">Código</th>
                <th className="p-3 font-medium">Descuento</th>
                <th className="p-3 font-medium">Aplica a</th>
                <th className="p-3 font-medium">Usos</th>
                <th className="p-3 font-medium">Vence</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-mono font-semibold">{c.code}</td>
                  <td className="p-3">{c.discountPercent}%</td>
                  <td className="p-3">{c.appliesToAll ? "Todas" : c.categoryNames.join(", ") || "—"}</td>
                  <td className="p-3">{c.quantity === null ? "Ilimitado" : `${c.remainingUses} / ${c.quantity}`}</td>
                  <td className="p-3">{c.expiresAt ? formatDate(c.expiresAt) : "Indefinido"}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={() => handleDelete(c.id)} className="text-black/40 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
