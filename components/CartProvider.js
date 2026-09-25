"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "vestra_cart";

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], couponCode: null };
    return JSON.parse(raw);
  } catch {
    return { items: [], couponCode: null };
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadCart();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(saved.items || []);
    setCouponCode(saved.couponCode || null);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, couponCode }));
  }, [items, couponCode, loaded]);

  const revalidateCoupon = useCallback(async (code, cartItems) => {
    if (!code) {
      setCoupon(null);
      setCouponError("");
      return;
    }
    try {
      const cartCategoryIds = cartItems.map((i) => i.categoryId).filter(Boolean);
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartCategoryIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "El cupón no es válido");
      setCoupon(data);
      setCouponError("");
    } catch (err) {
      setCoupon(null);
      setCouponCode(null);
      setCouponError(err.message);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (items.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCoupon(null);
      return;
    }
    if (couponCode) revalidateCoupon(couponCode, items);
  }, [items, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function addItem(product, size, qty = 1) {
    setItems((prev) => {
      const key = (i) => i.productId === product.id && i.size === size;
      const existing = prev.find(key);
      if (existing) {
        return prev.map((i) => (key(i) ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          categoryId: product.categoryId,
          imageUrl: product.images?.[0]?.url || null,
          size,
          qty,
        },
      ];
    });
  }

  function updateQty(productId, size, qty) {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId && i.size === size ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0),
    );
  }

  function removeItem(productId, size) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }

  function clearCart() {
    setItems([]);
    setCouponCode(null);
    setCoupon(null);
  }

  async function applyCoupon(code) {
    setCouponCode(code);
    await revalidateCoupon(code, items);
  }

  function removeCoupon() {
    setCouponCode(null);
    setCoupon(null);
    setCouponError("");
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = coupon
    ? Math.round(
        (coupon.appliesToAll
          ? subtotal
          : items.reduce((sum, i) => sum + (coupon.categoryIds.includes(i.categoryId) ? i.price * i.qty : 0), 0)) *
          (coupon.discountPercent / 100),
      )
    : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loaded,
        addItem,
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
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
