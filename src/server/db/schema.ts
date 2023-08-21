import { type InferModel, relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  uniqueIndex,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import type { AdapterAccount } from "next-auth/adapters";

export const links = sqliteTable(
  "links",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }),
    description: text("description"),
    slug: text("slug", { length: 256 }).notNull(),
    url: text("url").notNull(),
    viewCount: integer("view_count").default(0),
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

export type Link = InferModel<typeof links>; 

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export type User = InferModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);