import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { productCollections } from './product-collections';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  junctions: many(productCollections),
}));

export const insertCollectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date().optional(),
});

export const selectCollectionSchema = insertCollectionSchema.extend({
  id: z.string().uuid(),
});

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type SelectCollection = z.infer<typeof selectCollectionSchema>;