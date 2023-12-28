"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { deleteLink, generateShortLink } from "~/server/api/link";
import {
  createNewUserLink,
  getOrCreateUserLinkById,
  setUserLinkIdCookie,
} from "~/server/api/user-link";
import { type UserLink } from "~/server/db/schema";
import { z } from "zod";

import { action } from "~/lib/safe-action";
import { insertGuestLinkSchema } from "~/lib/validations/link";

export const createGuestShortLink = action(
  insertGuestLinkSchema,
  async ({ url }) => {
    const cookieStore = cookies();
    const userLinkId = cookieStore.get("user-link-id")?.value;
    let userLink: UserLink | undefined;

    if (!userLinkId) {
      userLink = await createNewUserLink();
    } else {
      userLink = await getOrCreateUserLinkById(userLinkId);
    }

    if (!userLink) {
      throw new Error("Error creating user link");
    }

    if (userLink.id !== userLinkId) {
      setUserLinkIdCookie(userLink.id);
    }

    await generateShortLink({
      url,
      userLinkId: userLink.id,
      isGuestUser: true,
      slug: "",
    });

    revalidatePath("/");

    return { message: "Link creation successful" };
  },
);

export const deleteShortLink = action(
  z.object({ slug: z.string() }),
  async ({ slug }) => {
    const cookieStore = cookies();
    const userLinkId = cookieStore.get("user-link-id")?.value;
    if (!userLinkId) {
      throw new Error("No user link id found");
    }

    await deleteLink(slug, userLinkId);

    revalidatePath("/");

    return { message: "Link deletion successful" };
  },
);
