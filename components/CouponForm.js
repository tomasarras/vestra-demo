"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CouponForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [appliesToAll, setAppliesToAll] = useState(true);
  const [categoryIds, setCategoryIds] = useState([]);
  const [quantityMode, setQuantityMode] = useState("unlimited");
  const [quantity, setQuantity] = useState(5);
  const [expiryMode, setExpiryMode] = useState("indefinite");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  function toggleCategory(id) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        code,
        discountPercent,
        appliesToAll,
        categoryIds,
        quantity: quantityMode === "unlimited" ? null : quantity,
        expiresInDays: expiryMode === "indefinite" ? null : expiresInDays,
      };
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/cupones");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Código</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DE5CUENT0"
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm uppercase"
            required
          />
        </div>
        <div className="w-32">
          <label className="mb-1 block text-sm font-medium">Descuento %</label>
          <input
            type="number"
            min="1"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Aplica a</label>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={appliesToAll} onChange={() => setAppliesToAll(true)} />
            Todas las categorías
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!appliesToAll} onChange={() => setAppliesToAll(false)} />
            Categorías específicas
          </label>
        </div>
        {!appliesToAll && (
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  categoryIds.includes(c.id) ? "border-black bg-black text-white" : "border-black/15 text-black/60"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Cantidad de cupones</label>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={quantityMode === "unlimited"} onChange={() => setQuantityMode("unlimited")} />
            Ilimitado
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={quantityMode === "limited"} onChange={() => setQuantityMode("limited")} />
            Limitado a
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onFocus={() => setQuantityMode("limited")}
              className="w-20 rounded-lg border border-black/15 px-2 py-1"
            />
            cupones
          </label>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Expira en</label>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={expiryMode === "indefinite"} onChange={() => setExpiryMode("indefinite")} />
            Indefinido
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={expiryMode === "days"} onChange={() => setExpiryMode("days")} />
            En
            <input
              type="number"
              min="1"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              onFocus={() => setExpiryMode("days")}
              className="w-20 rounded-lg border border-black/15 px-2 py-1"
            />
            días
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        Crear cupón
      </button>
    </form>
  );
}
