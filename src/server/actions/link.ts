"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  checkSlugExists,
  deleteLinkAndRevalidate,
  generateShortLink,
  updateLinkBySlug,
} from "~/server/api/link";
import {
  createNewUserLink,
  getOrCreateUserLinkById,
  getOrCreateUserLinkByUserId,
  getUserLinkByUserId,
  setUserLinkIdCookie,
} from "~/server/api/user-link";
import { type UserLink } from "~/server/db/schema";
import { z } from "zod";

import { action, authAction, MyCustomError } from "~/lib/safe-action";
import { editLinkSchema, insertLinkSchema } from "~/lib/validations/link";

import { getServerAuthSession } from "../auth";
import { redis } from "../redis";

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

export const editShortLink = authAction(
  editLinkSchema,
  async ({ slug, newLink }, { user }) => {
    const newUrl = encodeURIComponent(newLink.url);
    const newSlug = newLink.slug;

    const userLink = await getUserLinkByUserId(user.id);
    if (!userLink) {
      throw new MyCustomError("No user link found");
    }

    const link = userLink.links.find((link) => link.slug === slug);
    if (!link) {
      throw new MyCustomError("Link not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePromises: Promise<any>[] = [];

    if (newSlug !== slug) {
      const slugExists = await checkSlugExists(newSlug);
      if (slugExists) {
        throw new MyCustomError("Slug already exists");
      }

      updatePromises.push(
        updateLinkBySlug(slug, newLink),
        redis.del(slug.toLowerCase()),
        redis.set(newSlug.toLowerCase(), newUrl),
      );
    } else {
      updatePromises.push(
        updateLinkBySlug(slug, {
          ...newLink,
          slug: slug,
        }),
      );

      if (newUrl !== link.url) {
        updatePromises.push(redis.set(slug.toLowerCase(), newUrl));
      }
    }

    await Promise.all(updatePromises);

    revalidatePath("/");
    return { message: "Link edited successfully" };
  },
);

export const checkSlug = authAction(
  insertLinkSchema.pick({ slug: true }),
  async ({ slug }) => {
    return await checkSlugExists(slug);
  },
);
