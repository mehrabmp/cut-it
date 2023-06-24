import { type InferModel, relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  uniqueIndex,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const links = sqliteTable(
  "links",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }),
    description: text("description"),
    key: text("key", { length: 256 }).notNull(),
    url: text("url").notNull(),
    userId: integer("userId").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    updateAt: integer("updatedAt", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (links) => {
    return {
      keyIndex: uniqueIndex("key_idx").on(links.key),
    };
  }
);

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));

export type Link = InferModel<typeof links>;

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export type User = InferModel<typeof users>;
