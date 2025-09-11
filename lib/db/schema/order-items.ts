import { pgTable, uuid, numeric, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { productVariants } from './variants';
import { orders } from './orders';

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productVariantId: uuid('product_variant_id').references(() => productVariants.id, { onDelete: 'restrict' }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const insertOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.number(),
});
export const selectOrderItemSchema = insertOrderItemSchema.extend({
  id: z.string().uuid(),
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type SelectOrderItem = z.infer<typeof selectOrderItemSchema>;