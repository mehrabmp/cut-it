import { links } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const insertLinkSchema = createInsertSchema(links).pick({
  slug: true,
  url: true,
  description: true,
});
