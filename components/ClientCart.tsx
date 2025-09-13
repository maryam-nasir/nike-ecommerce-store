"use client";
import { useEffect } from "react";
import CartSummary from "./CartSummary";
import CartItemRow from "./CartItemRow";
import { useCartStore } from "@/store/cart";

function ClientCart() {
  const { items, hydrate } = useCartStore();

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="divide-y divide-light-300">
          {items.length === 0 ? (
            <p className="text-body text-dark-700">Your cart is empty.</p>
          ) : (
            items.map((it) => <CartItemRow key={it.id} item={it} />)
          )}
        </div>
      </div>
      <div className="lg:col-span-4">
        <CartSummary />
      </div>
    </div>
  );
}


export default ClientCart;