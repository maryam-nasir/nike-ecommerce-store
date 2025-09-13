"use client";

import { useCartStore } from "@/store/cart";
import { LuShoppingBag as ShoppingBag } from "react-icons/lu";

function AddToBagButton({ variantId }: { variantId?: string }) {
  const add = useCartStore((s) => s.add);
  return (
    <button
      className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-dark-900 text-white w-full disabled:opacity-50 cursor-pointer"
      disabled={!variantId}
      onClick={() => variantId && add(variantId, 1)}
    >
      <ShoppingBag className="h-5 w-5" />
      Add to Bag
    </button>
  );
}

export default AddToBagButton;