"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "Único"];

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [sizes, setSizes] = useState(product?.sizes || []);
  const [images, setImages] = useState(product?.images?.map((i) => i.url) || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  function toggleSize(size) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { name, description, price, categoryId: categoryId || null, sizes, images };
      const res = await fetch(isEdit ? `/api/products/${product.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Precio (ARS)</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Talles</label>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => toggleSize(size)}
              className={`rounded-full border px-3 py-1 text-sm ${
                sizes.includes(size) ? "border-black bg-black text-white" : "border-black/15 text-black/60"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Imágenes</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-black/10">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-black/25 text-xs text-black/50 hover:bg-black/5">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : "Subir"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {isEdit ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
