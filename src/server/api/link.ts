import { type SetCommandOptions } from "@upstash/redis";
import { db } from "~/server/db";
import { links, type NewShortLink, type ShortLink } from "~/server/db/schema";
import { redis } from "~/server/redis";
import { desc, eq } from "drizzle-orm";

import { GUEST_LINK_EXPIRE_TIME } from "~/lib/config";
import { nanoid } from "~/lib/utils";

export async function generateRandomSlug(): Promise<string> {
  const slug = nanoid();
  const link = await getLinkBySlug(slug);
  if (link) {
    return generateRandomSlug();
  }
  return slug;
}

export async function getLinkBySlug(
  slug: string,
): Promise<ShortLink | undefined> {
  const link = await db.query.links.findFirst({
    where: eq(links.slug, slug),
  });
  return link;
}

export async function getLinksByUserLinkId(
  userLinkId: string,
): Promise<ShortLink[]> {
  const shortLinks = await db.query.links.findMany({
    where: eq(links.userLinkId, userLinkId),
    orderBy: desc(links.createdAt),
  });
  return shortLinks;
}

export async function generateShortLink({
  slug,
  url,
  userLinkId,
  isGuestUser,
  ...rest
}: NewShortLink & { isGuestUser: boolean }): Promise<void> {
  const encodedURL = encodeURIComponent(url);

  if (slug) {
    const link = await getLinkBySlug(slug);
    if (link) {
      throw new Error("Slug already exists");
    }
  } else {
    slug = await generateRandomSlug();
  }

  const redisOptions: SetCommandOptions | undefined = isGuestUser
    ? { ex: GUEST_LINK_EXPIRE_TIME }
    : undefined;

  await Promise.all([
    db
      .insert(links)
      .values({ slug, url: encodedURL, userLinkId, ...rest })
      .run(),
    redis.set(slug, encodedURL, redisOptions),
  ]);
}
