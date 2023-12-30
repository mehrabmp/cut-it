import { cookies } from "next/headers";
import { getLinksByUserLinkId } from "~/server/api/link";
import { getUserLinkByUserId } from "~/server/api/user-link";
import { getServerAuthSession } from "~/server/auth";
import { type ShortLink } from "~/server/db/schema";
import { type Session } from "next-auth";

import { SigninDialog } from "../auth/signin-dialog";
import { LinkCard } from "./link-card";

const fetchLinksBySessionOrCookie = async (
  session: Session | null,
): Promise<ShortLink[]> => {
  const cookieStore = cookies();

  if (session) {
    const userLink = await getUserLinkByUserId(session.user.id);
    return await getLinksByUserLinkId(userLink?.id ?? "");
  } else {
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value;
    if (!userLinkIdCookie) {
      return [];
    }

    return await getLinksByUserLinkId(userLinkIdCookie);
  }
};

export const LinkList = async () => {
  const session = await getServerAuthSession();
  let shortLinks: ShortLink[] = [];

  try {
    shortLinks = await fetchLinksBySessionOrCookie(session);
  } catch (err) {
    throw new Error("Failed to fetch links");
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        {shortLinks.map((link) => (
          <LinkCard key={link.slug} {...link} />
        ))}
      </div>
      {!session && shortLinks.length > 0 && (
        <div className="text-xs text-muted-foreground px-4">
          Maximize your link's lifespan beyond 24 hours by{" "}
          <SigninDialog>
            <span className="underline cursor-pointer underline-offset-4 text-foreground">
              signing in
            </span>
          </SigninDialog>{" "}
          and accessing exclusive editing features!
        </div>
      )}
    </>
  );
};
