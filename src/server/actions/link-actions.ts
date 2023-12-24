"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { links } from "~/server/db/schema";
import { redis } from "~/server/redis";

import { action } from "~/lib/safe-action";
import { nanoid } from "~/lib/utils";
import { insertLinkSchema } from "~/lib/validations/link-schemas";

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
