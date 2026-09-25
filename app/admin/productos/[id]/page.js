"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import ProductForm from "@/components/ProductForm";

export default function EditarProductoPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <p className="mt-6 text-sm text-red-600">Producto no encontrado.</p>;
  if (!product) return <p className="mt-6 text-sm text-black/40">Cargando…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <ProductForm product={product} />
    </div>
  );
}
