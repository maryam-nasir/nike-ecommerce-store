import { pgTable, serial, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
