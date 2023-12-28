import { cookies } from "next/headers";
import { db } from "~/server/db";
import { userLinks, type UserLink } from "~/server/db/schema";
import { eq } from "drizzle-orm";

import { GUEST_LINK_COOKIE_EXPIRATION_TIME } from "~/lib/config";

export async function createNewUserLink(
  userId?: string,
): Promise<UserLink | undefined> {
  const newUserLink = await db.insert(userLinks).values({ userId }).returning();
  return newUserLink[0];
}

export async function getUserLinkById(
  id: string,
): Promise<UserLink | undefined> {
  const userLink = await db.query.userLinks.findFirst({
    where: eq(userLinks.id, id),
  });
  return userLink;
}

export async function getUserLinkByUserId(
  userId: string,
): Promise<UserLink | undefined> {
  const userLink = await db.query.userLinks.findFirst({
    where: eq(userLinks.userId, userId),
  });
  return userLink;
}

export async function getOrCreateUserLinkByUserId(
  userId: string,
): Promise<UserLink> {
  const userLink = await getUserLinkByUserId(userId);
  if (userLink) {
    return userLink;
  }

  const newUserLink = await createNewUserLink(userId);
  if (!newUserLink) {
    throw new Error("Error creating user link");
  }

  return newUserLink;
}

export async function getOrCreateUserLinkById(id: string): Promise<UserLink> {
  const userLink = await getUserLinkById(id);
  if (userLink) {
    return userLink;
  }

  const newUserLink = await createNewUserLink();
  if (!newUserLink) {
    throw new Error("Error creating user link");
  }

  return newUserLink;
}

export function setUserLinkIdCookie(id: string) {
  const cookieStore = cookies();

  cookieStore.set("user-link-id", id, {
    expires: new Date(Date.now() + GUEST_LINK_COOKIE_EXPIRATION_TIME),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
}
