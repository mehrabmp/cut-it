import { links } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const insertLinkSchema = createInsertSchema(links).pick({
  slug: true,
  url: true,
  description: true,
});

export const editLinkSchema = z.object({
  slug: z.string(),
  newLink: createInsertSchema(links).pick({
    slug: true,
    url: true,
    description: true,
  }),
});
