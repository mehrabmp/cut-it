"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { deleteLinkAndRevalidate, generateShortLink } from "~/server/api/link";
import {
  createNewUserLink,
  getOrCreateUserLinkById,
  getOrCreateUserLinkByUserId,
  getUserLinkByUserId,
  setUserLinkIdCookie,
} from "~/server/api/user-link";
import { type UserLink } from "~/server/db/schema";
import { z } from "zod";

import { action, authAction } from "~/lib/safe-action";
import {
  insertGuestLinkSchema,
  insertUserLinkSchema,
} from "~/lib/validations/link";

import { getServerAuthSession } from "../auth";

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

export const createUserShortLink = authAction(
  insertUserLinkSchema,
  async (input, { user }) => {
    const userLink = await getOrCreateUserLinkByUserId(user.id);

    await generateShortLink({
      userLinkId: userLink.id,
      ...input,
    });

    revalidatePath("/");

    return { message: "Link creation successful" };
  },
);

export const deleteShortLink = action(
  z.object({ slug: z.string() }),
  async ({ slug }) => {
    const cookieStore = cookies();
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value;

    if (userLinkIdCookie) {
      return await deleteLinkAndRevalidate(slug, userLinkIdCookie);
    }

    const session = await getServerAuthSession();
    if (!session) {
      throw new Error("Session not found!");
    }

    const userLink = await getUserLinkByUserId(session.user.id);
    if (!userLink) {
      throw new Error("No user link found");
    }

    return await deleteLinkAndRevalidate(slug, userLink.id);
  },
);
