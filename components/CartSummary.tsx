"use client";

import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth/actions";

export default function CartSummary() {
  const { subtotal, estimatedShipping, total, itemCount } = useCartStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(Boolean(user));
    })();
  }, []);

  const handleCheckout = async () => {
    if (isLoggedIn === false) {
      window.location.href = "/auth";
      return;
    }
    window.location.href = "/checkout";
  };

  return (
    <aside className="rounded-2xl border border-light-300 p-6">
      <h2 className="text-body-medium text-dark-900 mb-4">Summary</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-body">
          <span className="text-dark-700">Subtotal</span>
          <span className="text-dark-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-body">
          <span className="text-dark-700">Estimated Delivery & Handling</span>
          <span className="text-dark-900">${estimatedShipping.toFixed(2)}</span>
        </div>
        <hr className="border-light-300" />
        <div className="flex items-center justify-between text-body-medium">
          <span className="text-dark-700">Total</span>
          <span className="text-dark-900">${total.toFixed(2)}</span>
        </div>
      </div>
      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-dark-900 px-5 text-white disabled:opacity-50"
        onClick={handleCheckout}
        disabled={itemCount === 0}
      >
        Proceed to Checkout
      </button>
    </aside>
  );
}


