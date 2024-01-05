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

import { action, MyCustomError } from "~/lib/safe-action";
import { insertLinkSchema } from "~/lib/validations/link";

import { getServerAuthSession } from "../auth";

export const createShortLink = action(
  insertLinkSchema,
  async ({ url, slug, description }) => {
    const session = await getServerAuthSession();

    if (session) {
      const userLink = await getOrCreateUserLinkByUserId(session.user.id);

      await generateShortLink({
        userLinkId: userLink.id,
        slug,
        url,
        description,
      });
    } else {
      const cookieStore = cookies();
      const userLinkId = cookieStore.get("user-link-id")?.value;
      let userLink: UserLink | undefined;

      if (!userLinkId) {
        userLink = await createNewUserLink();
      } else {
        userLink = await getOrCreateUserLinkById(userLinkId);
      }

      if (!userLink) {
        throw new MyCustomError("Error in creating user link");
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
    }

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
      throw new MyCustomError("Session not found!");
    }

    const userLink = await getUserLinkByUserId(session.user.id);
    if (!userLink) {
      throw new MyCustomError("No user link found");
    }

    return await deleteLinkAndRevalidate(slug, userLink.id);
  },
);
