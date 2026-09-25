"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

export default function CarritoPage() {
  const {
    items,
    loaded,
    updateQty,
    removeItem,
    clearCart,
    couponCode,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
  } = useCart();

  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [order, setOrder] = useState(null);

  async function handleApplyCoupon(e) {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setApplying(true);
    await applyCoupon(codeInput.trim());
    setApplying(false);
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, couponCode: coupon ? couponCode : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
      clearCart();
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setCheckingOut(false);
    }
  }

  if (!loaded) return null;

  if (order) {
    return (
      <>
        <StoreHeader />
        <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-bold">¡Gracias por tu compra!</h1>
          <p className="mt-2 text-sm text-black/50">Compra simulada — no se realizó ningún cargo real.</p>
          <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 text-left">
            <p className="text-sm text-black/50">Pedido #{order.id.slice(-8)}</p>
            <ul className="mt-3 divide-y divide-black/10 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between py-2">
                  <span>
                    {i.productName} {i.size && `(${i.size})`} × {i.quantity}
                  </span>
                  <span>{formatCurrency(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            {order.discountAmount > 0 && (
              <div className="mt-2 flex justify-between text-sm text-accent">
                <span>Descuento ({order.couponCode})</span>
                <span>−{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          <Link href="/tienda" className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Seguir comprando
          </Link>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <StoreHeader />
        <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
          <Link href="/tienda" className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Ir a la tienda
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Tu carrito</h1>

        <ul className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
          {items.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="" fill className="object-cover" />
                ) : (
                  <ProductImagePlaceholder className="h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-sm text-black/50">
                  {item.size && `Talle ${item.size} · `}
                  {formatCurrency(item.price)}
                </p>
                <div className="mt-1 flex w-fit items-center rounded-full border border-black/15 text-sm">
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                    className="px-2.5 py-0.5"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                    className="px-2.5 py-0.5"
                  >
                    +
                  </button>
                </div>
              </div>
              <span className="font-semibold">{formatCurrency(item.price * item.qty)}</span>
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.size)}
                className="text-black/30 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">
          {coupon ? (
            <div className="flex items-center justify-between text-sm">
              <span>
                Cupón <span className="font-mono font-semibold">{couponCode}</span> aplicado (−{coupon.discountPercent}%)
              </span>
              <button type="button" onClick={removeCoupon} className="text-black/40 hover:text-red-600">
                Quitar
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Código de cupón"
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm uppercase"
              />
              <button
                type="submit"
                disabled={applying}
                className="flex items-center gap-1.5 rounded-lg border border-black px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {applying && <Loader2 size={14} className="animate-spin" />}
                Aplicar
              </button>
            </form>
          )}
          {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}

          <div className="mt-5 space-y-1 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-black/50">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Descuento</span>
                <span>−{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {checkoutError && <p className="mt-3 text-sm text-red-600">{checkoutError}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {checkingOut && <Loader2 size={14} className="animate-spin" />}
            Confirmar compra (simulada)
          </button>
        </div>
      </main>
    </>
  );
}
