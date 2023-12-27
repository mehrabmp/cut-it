import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  link: one(links, { fields: [users.id], references: [links.userId] }),
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
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const links = sqliteTable(
  "link",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (link) => ({
    userIdIdx: uniqueIndex("links_userId_idx").on(link.userId),
  }),
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;

export const linksRelations = relations(links, ({ many }) => ({
  linkItems: many(linkItems),
}));

export const linkItems = sqliteTable(
  "linkItem",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    linkId: text("linkId")
      .references(() => links.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: text("title", { length: 256 }),
    description: text("description"),
    slug: text("slug", { length: 256 }).notNull(),
    url: text("url").notNull(),
    views: integer("views").default(0).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (links) => ({
    linkIdIdx: index("linkId_idx").on(links.linkId),
    slugIdx: uniqueIndex("slug_idx").on(links.slug),
  }),
);

export type LinkItem = typeof linkItems.$inferSelect;
export type NewLinkItem = typeof linkItems.$inferInsert;

export const linkItemsRelations = relations(linkItems, ({ one }) => ({
  link: one(links, { fields: [linkItems.linkId], references: [links.id] }),
}));
