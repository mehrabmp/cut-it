"use server";

import { db } from "@/server/db";
import { links, insertLinkSchema } from "@/server/db/schema";
import { action } from "@/lib/utils";
import { nanoid } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redis } from "@/server/redis";

export const createShortLink = action(insertLinkSchema, async (input) => {
  const slug = nanoid();
  const encodedURL = encodeURIComponent(input.url);

  await Promise.all([
    db
      .insert(links)
      .values({ ...input, slug, userId: 1, url: encodedURL })
      .run(),
    redis.set(slug, encodedURL),
  ]);

  revalidatePath("/");

  return {
    message: "success",
  };
});
