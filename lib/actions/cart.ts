"use server";

import { cookies } from "next/headers";
import { sql, and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  carts,
  cartItems,
  productVariants,
  products,
  colors,
  sizes,
  productImages,
  guests,
} from "@/lib/db/schema";
import { z } from "zod";

type CartItemDTO = {
  id: string; // cart_item id
  variantId: string;
  productId: string;
  name: string;
  color: { name: string; slug: string; hexCode: string } | null;
  size: { name: string; slug: string } | null;
  price: number; // current unit price (sale or price)
  compareAt?: number; // original price if on sale
  quantity: number;
  imageUrl: string | null;
};

export type CartDTO = {
  cartId: string;
  items: CartItemDTO[];
  subtotal: number;
  estimatedShipping: number;
  total: number;
  itemCount: number;
};

async function getSessionUser() {
  try {
    const session = await auth.api.getSession({ headers: {} as any });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

async function getOrCreateGuestByCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("guest_session")?.value;
  if (!token) return null;
  const [g] = await db
    .select({ id: guests.id, sessionToken: guests.sessionToken })
    .from(guests)
    .where(eq(guests.sessionToken, token));
  return g ?? null;
}

export async function ensureActiveCart(): Promise<{ cartId: string; owner: { userId?: string | null; guestId?: string | null } }>
{
  const user = await getSessionUser();
  if (user) {
    // If user logged in, ensure a cart
    const [existing] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, user.id));
    if (existing) return { cartId: existing.id, owner: { userId: user.id } };
    const [created] = await db
      .insert(carts)
      .values({ userId: user.id })
      .returning({ id: carts.id });
    return { cartId: created.id, owner: { userId: user.id } };
  }

  // Guest
  const cookieStore = await cookies();
  let token = cookieStore.get("guest_session")?.value;
  if (!token) {
    // lazily create guest record and cookie compatible with existing auth/actions.ts
    const { v4: uuidv4 } = await import("uuid");
    const sessionToken = uuidv4();
    const maxAge = 60 * 60 * 24 * 7;
    const expiresAt = new Date(Date.now() + maxAge * 1000);
    const [g] = await db
      .insert(guests)
      .values({ sessionToken, expiresAt })
      .returning({ id: guests.id, sessionToken: guests.sessionToken });
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge,
    });
    token = g.sessionToken as string;
  }

  const [guestRow] = await db
    .select({ id: guests.id })
    .from(guests)
    .where(eq(guests.sessionToken, token!));

  if (!guestRow) {
    throw new Error("Guest session not found");
  }

  const [existing] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.guestId, guestRow.id));
  if (existing) return { cartId: existing.id, owner: { guestId: guestRow.id } };
  const [created] = await db
    .insert(carts)
    .values({ guestId: guestRow.id })
    .returning({ id: carts.id });
  return { cartId: created.id, owner: { guestId: guestRow.id } };
}

async function selectCart(cartId: string): Promise<CartDTO> {
  const rows = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      productId: products.id,
      name: products.name,
      price: sql<string>`coalesce(${productVariants.salePrice}, ${productVariants.price})`.as("price"),
      compareAt: sql<string | null>`nullif(${productVariants.price}, coalesce(${productVariants.salePrice}, ${productVariants.price}))`.as(
        "compare_at"
      ),
      colorName: colors.name,
      colorSlug: colors.slug,
      colorHex: colors.hexCode,
      sizeName: sizes.name,
      sizeSlug: sizes.slug,
      imageUrl: sql<string>`coalesce(
        (
          select pi.url from product_images pi
          where pi.product_id = ${products.id} and pi.variant_id = ${productVariants.id}
          order by pi.is_primary desc, pi.sort_order asc
          limit 1
        ),
        (
          select pi2.url from product_images pi2
          where pi2.product_id = ${products.id} and pi2.variant_id is null
          order by pi2.is_primary desc, pi2.sort_order asc
          limit 1
        )
      )`.as("image_url"),
    })
    .from(cartItems)
    .innerJoin(carts, eq(carts.id, cartItems.cartId))
    .innerJoin(productVariants, eq(productVariants.id, cartItems.productVariantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(eq(cartItems.cartId, cartId));

  const items: CartItemDTO[] = rows.map((r) => ({
    id: r.cartItemId,
    variantId: r.variantId,
    productId: r.productId,
    name: r.name,
    color: r.colorName
      ? { name: r.colorName, slug: r.colorSlug ?? "", hexCode: r.colorHex ?? "" }
      : null,
    size: r.sizeName ? { name: r.sizeName, slug: r.sizeSlug ?? "" } : null,
    price: Number(r.price ?? 0),
    compareAt: r.compareAt != null ? Number(r.compareAt) : undefined,
    quantity: r.quantity,
    imageUrl: r.imageUrl ?? null,
  }));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const estimatedShipping = items.length > 0 ? 2 : 0;
  const total = subtotal + estimatedShipping;

  return {
    cartId,
    items,
    subtotal: Number(subtotal.toFixed(2)),
    estimatedShipping,
    total: Number(total.toFixed(2)),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

export async function getCart(): Promise<CartDTO> {
  const { cartId } = await ensureActiveCart();
  return selectCart(cartId);
}

const AddItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export async function addCartItem(input: z.infer<typeof AddItemSchema>): Promise<CartDTO> {
  const data = AddItemSchema.parse(input);
  const { cartId } = await ensureActiveCart();

  const [existing] = await db
    .select({ id: cartItems.id, quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, data.productVariantId)));

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + data.quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, productVariantId: data.productVariantId, quantity: data.quantity });
  }

  return selectCart(cartId);
}

const UpdateItemSchema = z.object({
  cartItemId: z.string().uuid(),
  quantity: z.number().int().min(1).optional(),
  productVariantId: z.string().uuid().optional(),
});

export async function updateCartItem(input: z.infer<typeof UpdateItemSchema>): Promise<CartDTO> {
  const data = UpdateItemSchema.parse(input);
  const { cartId } = await ensureActiveCart();

  if (data.productVariantId) {
    await db
      .update(cartItems)
      .set({ productVariantId: data.productVariantId, ...(data.quantity ? { quantity: data.quantity } : {}) })
      .where(eq(cartItems.id, data.cartItemId));
  } else if (data.quantity) {
    await db.update(cartItems).set({ quantity: data.quantity }).where(eq(cartItems.id, data.cartItemId));
  }

  return selectCart(cartId);
}

export async function removeCartItem(cartItemId: string): Promise<CartDTO> {
  const { cartId } = await ensureActiveCart();
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return selectCart(cartId);
}

export async function clearCart(): Promise<CartDTO> {
  const { cartId } = await ensureActiveCart();
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  return selectCart(cartId);
}

// Merge guest cart into user cart, used right after user logs in/signs up
export async function mergeGuestCartIntoUserCart(): Promise<{ ok: true }>
{
  const user = await getSessionUser();
  if (!user) return { ok: true };

  const cookieStore = await cookies();
  const token = cookieStore.get("guest_session")?.value;
  if (!token) return { ok: true };

  const [guestRow] = await db.select({ id: guests.id }).from(guests).where(eq(guests.sessionToken, token));
  if (!guestRow) {
    cookieStore.delete("guest_session");
    return { ok: true };
  }

  // Ensure both carts exist
  const [userCart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, user.id));
  const userCartId = userCart
    ? userCart.id
    : (await db.insert(carts).values({ userId: user.id }).returning({ id: carts.id }))[0].id;

  const [guestCart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.guestId, guestRow.id));

  if (guestCart) {
    // Move/merge items
    const items = await db
      .select({ id: cartItems.id, variantId: cartItems.productVariantId, quantity: cartItems.quantity })
      .from(cartItems)
      .where(eq(cartItems.cartId, guestCart.id));

    for (const it of items) {
      const [existing] = await db
        .select({ id: cartItems.id, quantity: cartItems.quantity })
        .from(cartItems)
        .where(and(eq(cartItems.cartId, userCartId), eq(cartItems.productVariantId, it.variantId)));
      if (existing) {
        await db
          .update(cartItems)
          .set({ quantity: existing.quantity + it.quantity })
          .where(eq(cartItems.id, existing.id));
      } else {
        await db.insert(cartItems).values({ cartId: userCartId, productVariantId: it.variantId, quantity: it.quantity });
      }
    }

    // Clear guest cart and row
    await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
    await db.delete(carts).where(eq(carts.id, guestCart.id));
  }

  // Remove guest cookie and row
  await db.delete(guests).where(eq(guests.id, guestRow.id));
  cookieStore.delete("guest_session");
  return { ok: true };
}


