"use server";

import { db } from "@/server/db";
import { links, insertLinkSchema } from "@/server/db/schema";
import { action } from "@/lib/utils";
import { nanoid } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createShortLink = action(insertLinkSchema, async (input) => {
  const slug = nanoid();
  await db
    .insert(links)
    .values({ ...input, slug, userId: 1 })
    .run();

  revalidatePath("/");
});
