import { linkItems } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const insertPublicLinkSchema = createInsertSchema(linkItems).pick({
  url: true,
});

export const insertAuthLinkSchema = createInsertSchema(linkItems).pick({
  slug: true,
  url: true,
  title: true,
  description: true,
});
