import { revalidatePath } from "next/cache";
import { type SetCommandOptions } from "@upstash/redis";
import { db } from "~/server/db";
import { links, type NewShortLink, type ShortLink } from "~/server/db/schema";
import { redis } from "~/server/redis";
import { and, desc, eq, gte, lte } from "drizzle-orm";

import { GUEST_LINK_EXPIRE_TIME } from "~/lib/config";
import { MyCustomError } from "~/lib/safe-action";
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
  const currentDate = new Date();
  const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // Calculate one day ago

  const shortLinks = await db.query.links.findMany({
    where: and(
      eq(links.userLinkId, userLinkId),
      gte(links.createdAt, oneDayAgo),
      lte(links.createdAt, currentDate),
    ),
    orderBy: desc(links.createdAt),
  });
  return shortLinks;
}

export async function generateShortLink({
  slug,
  url,
  userLinkId,
  isGuestUser,
  description,
}: NewShortLink & { isGuestUser?: boolean }): Promise<void> {
  const encodedURL = encodeURIComponent(url);

  if (slug) {
    const link = await getLinkBySlug(slug);
    if (link) {
      throw new MyCustomError("Slug already exists");
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
      .values({ slug, url: encodedURL, userLinkId, description })
      .run(),
    redis.set(slug, encodedURL, redisOptions),
  ]);
}

export async function deleteLink(
  slug: string,
  userLinkId: string,
): Promise<void> {
  const link = await getLinkBySlug(slug);
  if (!link) {
    throw new MyCustomError("Link not found");
  }

  if (link.userLinkId !== userLinkId) {
    throw new MyCustomError("Link not found");
  }

  await Promise.all([
    db.delete(links).where(eq(links.slug, slug)).run(),
    redis.del(slug),
  ]);
}

export async function deleteLinkAndRevalidate(slug: string, id: string) {
  await deleteLink(slug, id);

  revalidatePath("/");

  return { message: "Link deletion successful" };
}

export async function updateLinksByUserLinkId(
  userLinkId: string,
  data: Partial<ShortLink>,
): Promise<void> {
  await db
    .update(links)
    .set(data)
    .where(eq(links.userLinkId, userLinkId))
    .run();
}
