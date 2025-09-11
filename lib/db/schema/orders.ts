import { pgEnum, pgTable, uuid, timestamp, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { users } from './user';
import { addresses } from './addresses';
import { orderItems } from './order-items';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').references(() => addresses.id, { onDelete: 'set null' }),
  billingAddressId: uuid('billing_address_id').references(() => addresses.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
}));

export const insertOrderSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
  totalAmount: z.number(),
  shippingAddressId: z.string().uuid().optional().nullable(),
  billingAddressId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
});

export const selectOrderSchema = insertOrderSchema.extend({
  id: z.string().uuid(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SelectOrder = z.infer<typeof selectOrderSchema>;