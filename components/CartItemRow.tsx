"use client";

import Image from "next/image";
import { LuTrash2 as Trash, LuMinus as Minus, LuPlus as Plus } from "react-icons/lu";
import { useCartStore } from "@/store/cart";
import type { CartLineItem } from "@/store/cart";

type Props = {
  item: CartLineItem;
};

export default function CartItemRow({ item }: Props) {
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);

  const price = (item.price * item.quantity).toFixed(2);

  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4 py-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-md bg-light-200">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        )}
      </div>

      <div>
        <p className="text-body-medium text-dark-900">{item.name}</p>
        <p className="text-caption text-dark-700 capitalize">
          {item.size?.name ? `${item.size.name}` : ""}
          {item.color?.name ? ` • ${item.color.name}` : ""}
        </p>

        <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-light-300 bg-light-100 px-3 py-1">
          <span className="text-caption text-dark-700">Quantity</span>
          <button
            className="p-1 rounded-full hover:bg-light-200"
            aria-label="Decrease"
            onClick={() => update(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-5 text-center text-body-medium">{item.quantity}</span>
          <button
            className="p-1 rounded-full hover:bg-light-200"
            aria-label="Increase"
            onClick={() => update(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-body-medium text-dark-900">${price}</span>
        <button className="text-red hover:underline" onClick={() => remove(item.id)} aria-label="Remove item">
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


