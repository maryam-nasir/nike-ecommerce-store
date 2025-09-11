import { pgTable, uuid, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { users } from "./user";

export const addressType = pgEnum("address_type", ["billing", "shipping"]);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: addressType("type").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const insertAddressSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["billing", "shipping"]),
  line1: z.string().min(1),
  line2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().optional(),
});
export const selectAddressSchema = insertAddressSchema.extend({ id: z.string().uuid() });

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type SelectAddress = z.infer<typeof selectAddressSchema>;
