import { links } from "~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
