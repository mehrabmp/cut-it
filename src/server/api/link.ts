import { cookies } from "next/headers";
import { type SetCommandOptions } from "@upstash/redis";
import { db } from "~/server/db";
import {
  linkItems,
  links,
  type Link,
  type LinkItem,
  type NewLinkItem,
} from "~/server/db/schema";
import { redis } from "~/server/redis";
import { desc, eq } from "drizzle-orm";

import {
  GUEST_LINK_COOKIE_EXPIRATION_TIME,
  GUEST_LINK_EXPIRE_TIME,
} from "~/lib/config";
import { nanoid } from "~/lib/utils";

export async function doesSlugExist(slug: string): Promise<boolean> {
  const existingSlug = await db.query.linkItems.findFirst({
    where: eq(linkItems.slug, slug),
  });
  return Boolean(existingSlug);
}

export async function generateRandomSlug(): Promise<string> {
  const slug = nanoid();

  const slugExists = await doesSlugExist(slug);
  if (slugExists) {
    return generateRandomSlug();
  }
  return slug;
}

export async function createNewLink(
  userId?: string,
): Promise<Link | undefined> {
  const newLink = await db.insert(links).values({ userId }).returning();
  return newLink[0];
}

export async function getLinkById(id: string): Promise<Link | undefined> {
  const link = await db.query.links.findFirst({
    where: eq(links.id, id),
  });
  return link;
}

export async function getLinkByUserId(
  userId: string,
): Promise<Link | undefined> {
  const link = await db.query.links.findFirst({
    where: eq(links.userId, userId),
  });
  return link;
}

export async function getOrCreateLinkByUserId(userId: string): Promise<Link> {
  const link = await getLinkByUserId(userId);
  if (link) {
    return link;
  }

  const newLink = await createNewLink(userId);
  if (!newLink) {
    throw new Error("Error creating link");
  }

  return newLink;
}

export async function getOrCreateLinkById(id: string): Promise<Link> {
  const link = await getLinkById(id);
  if (link) {
    return link;
  }

  const newLink = await createNewLink();
  if (!newLink) {
    throw new Error("Error creating link");
  }

  return newLink;
}

export async function getShortLinksByLinkId(
  linkId: string,
): Promise<LinkItem[]> {
  const items = await db.query.linkItems.findMany({
    where: eq(linkItems.linkId, linkId),
    orderBy: desc(linkItems.createdAt),
  });
  return items;
}

export async function generateShortLink({
  slug: customSlug,
  url,
  linkId,
  isGuestUser,
  ...rest
}: NewLinkItem & { isGuestUser: boolean }): Promise<void> {
  const encodedURL = encodeURIComponent(url);
  let slug: string;

  if (customSlug) {
    const isSlugExists = await doesSlugExist(customSlug);
    if (isSlugExists) {
      throw new Error("Slug already exists");
    }

    slug = customSlug;
  } else {
    slug = await generateRandomSlug();
  }

  const redisOptions: SetCommandOptions | undefined = isGuestUser
    ? { ex: GUEST_LINK_EXPIRE_TIME }
    : undefined;

  await Promise.all([
    db
      .insert(linkItems)
      .values({ slug, url: encodedURL, linkId, ...rest })
      .run(),
    redis.set(slug, encodedURL, redisOptions),
  ]);
}

export function setLinkIdCookie(linkId: string) {
  const cookieStore = cookies();

  cookieStore.set("link-id", linkId, {
    expires: new Date(Date.now() + GUEST_LINK_COOKIE_EXPIRATION_TIME),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
}
