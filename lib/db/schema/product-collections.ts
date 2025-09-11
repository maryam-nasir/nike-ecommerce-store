import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { collections } from './collections';

export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'cascade' }).notNull(),
});

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
}));

export const insertProductCollectionSchema = z.object({
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const selectProductCollectionSchema = insertProductCollectionSchema.extend({
  id: z.string().uuid(),
});

export type InsertProductCollection = z.infer<typeof insertProductCollectionSchema>;
export type SelectProductCollection = z.infer<typeof selectProductCollectionSchema>;