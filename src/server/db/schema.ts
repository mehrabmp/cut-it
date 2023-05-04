import type { InferModel } from "drizzle-orm";
import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  key: varchar("key", { length: 255 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updateAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Link = InferModel<typeof links>;
