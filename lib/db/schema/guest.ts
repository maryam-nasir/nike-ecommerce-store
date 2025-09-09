import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const guests = pgTable("guests", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("sessionToken").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});
