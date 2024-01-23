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
  .extend({
    url: z.string().url(),
    slug: z
      .string()
      .max(30, "Maximum 30 characters allowed.")
      .refine((value) => slugRegex.test(value), {
        message:
          "Slugs can only contain letters, numbers, hyphens, and underscores.",
      }),
    description: z
      .string()
      .max(255, "Maximum 255 characters allowed.")
      .optional(),
  });

export const editLinkSchema = z.object({
  slug: z.string(),
  newLink: insertLinkSchema,
});
