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
    slug: text("slug", { length: 256 }).notNull(),
    url: text("url").notNull(),
    userId: integer("user_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
    updateAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
  },
  (links) => {
    return {
      keyIndex: uniqueIndex("slug_idx").on(links.slug),
    };
  },
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
