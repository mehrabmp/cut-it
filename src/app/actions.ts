"use server";

import { db } from "@/server/db";
import { links, insertLinkSchema } from "@/server/db/schema";
import { zact } from "zact/server";
import { nanoid } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";

export const createShortLink = zact(insertLinkSchema)(async (input) => {
  try {
    const key = nanoid();
    await db.insert(links).values({ ...input, key, userId: 5 });
    await kv.set(key, input.url);
    revalidatePath("/");
  } catch (error) {}
});
