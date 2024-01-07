import { links } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { slugRegex } from "~/lib/utils";

export const insertLinkSchema = createInsertSchema(links)
  .pick({
    slug: true,
    url: true,
    description: true,
  })
  .refine((values) => slugRegex.test(values.slug), {
    message:
      "Slugs can only contain letters, numbers, hyphens, and underscores.",
  });

export const editLinkSchema = z.object({
  slug: z.string(),
  newLink: insertLinkSchema,
});
