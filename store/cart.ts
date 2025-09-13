import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartDTO } from "@/lib/actions/cart";
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart as serverClear } from "@/lib/actions/cart";

type ClientCartItem = CartDTO["items"][number];
export type CartLineItem = ClientCartItem;

interface CartState {
  items: ClientCartItem[];
  subtotal: number;
  estimatedShipping: number;
  total: number;
  itemCount: number;
  isHydrating: boolean;
  hydrate: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  update: (cartItemId: string, quantity: number) => Promise<void>;
  remove: (cartItemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      estimatedShipping: 0,
      total: 0,
      itemCount: 0,
      isHydrating: false,
      async hydrate() {
        try {
          set({ isHydrating: true });
          const cart = await getCart();
          set({
            items: cart.items,
            subtotal: cart.subtotal,
            estimatedShipping: cart.estimatedShipping,
            total: cart.total,
            itemCount: cart.itemCount,
            isHydrating: false,
          });
        } catch {
          set({ isHydrating: false });
        }
      },
      async add(variantId, quantity = 1) {
        const cart = await addCartItem({ productVariantId: variantId, quantity });
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          estimatedShipping: cart.estimatedShipping,
          total: cart.total,
          itemCount: cart.itemCount,
        });
      },
      async update(cartItemId, quantity) {
        const cart = await updateCartItem({ cartItemId, quantity });
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          estimatedShipping: cart.estimatedShipping,
          total: cart.total,
          itemCount: cart.itemCount,
        });
      },
      async remove(cartItemId) {
        const cart = await removeCartItem(cartItemId);
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          estimatedShipping: cart.estimatedShipping,
          total: cart.total,
          itemCount: cart.itemCount,
        });
      },
      async clear() {
        const cart = await serverClear();
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          estimatedShipping: cart.estimatedShipping,
          total: cart.total,
          itemCount: cart.itemCount,
        });
      },
    }),
    { name: "cart-sync" }
  )
);
