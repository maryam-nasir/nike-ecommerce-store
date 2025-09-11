import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { users } from "./user";
import { guests } from "./guest";
import { cartItems } from "./cart-items";

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  guestId: uuid("guest_id").references(() => guests.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  guest: one(guests, {
    fields: [carts.guestId],
    references: [guests.id],
  }),
  items: many(cartItems),
}));    

export const insertCartSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  guestId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectCartSchema = insertCartSchema.extend({ id: z.string().uuid() });

export type InsertCart = z.infer<typeof insertCartSchema>;
export type SelectCart = z.infer<typeof selectCartSchema>;
