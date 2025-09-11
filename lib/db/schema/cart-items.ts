import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { carts } from "./carts";
import { productVariants } from "./variants";

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const insertCartItemSchema = z.object({
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const selectCartItemSchema = insertCartItemSchema.extend({ id: z.string().uuid() });

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type SelectCartItem = z.infer<typeof selectCartItemSchema>;
