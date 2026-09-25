"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function CategoriasPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setName("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta categoría? Los productos que la usan quedarán sin categoría.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Categorías</h1>

      <form onSubmit={handleCreate} className="mt-6 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la categoría"
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Agregar
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 max-w-md divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
        {loading && <li className="p-4 text-sm text-black/40">Cargando…</li>}
        {!loading && categories.length === 0 && <li className="p-4 text-sm text-black/40">Todavía no hay categorías.</li>}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">{c.name}</span>
            <button type="button" onClick={() => handleDelete(c.id)} className="text-black/40 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
