import { type InferModel, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  serial,
  timestamp,
  varchar,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";

export const links = pgTable(
  "links",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    description: text("description"),
    key: varchar("key", { length: 256 }).notNull(),
    url: text("url").notNull(),
    userId: integer("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updateAt: timestamp("updatedAt").defaultNow().notNull(),
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export type User = InferModel<typeof users>;
