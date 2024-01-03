import { links } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const insertGuestLinkSchema = createInsertSchema(links).pick({
  url: true,
});

export const insertUserLinkSchema = createInsertSchema(links).pick({
  slug: true,
  url: true,
  description: true,
});
