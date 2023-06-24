"use server";

import { db } from "@/server/db";
import { links, insertLinkSchema } from "@/server/db/schema";
import { zact } from "zact/server";
import { nanoid } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createShortLink = zact(insertLinkSchema)(async (input) => {
  try {
    const key = nanoid();
    await db.insert(links).values({ ...input, key, userId: 1 });
    revalidatePath("/");
  } catch (error) {}
});
