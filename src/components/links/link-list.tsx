import { cookies } from "next/headers";
import Link from "next/link";
import { getLinksByUserLinkId } from "~/server/api/link";

import { LinkCard } from "./link-card";

export const LinkList = async () => {
  const cookieStore = cookies();
  const userLinkId = cookieStore.get("user-link-id");
  if (!userLinkId) {
    return null;
  }

  const shortLinks = await getLinksByUserLinkId(userLinkId.value);

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        {shortLinks.map((link) => (
          <LinkCard key={link.slug} {...link} />
        ))}
      </div>
      {shortLinks.length > 0 && (
        <div className="text-xs text-muted-foreground px-4">
          Maximize your link's lifespan beyond 24 hours by{" "}
          <Link
            href="/signin"
            className="underline underline-offset-4 text-foreground"
          >
            signing in
          </Link>{" "}
          and accessing exclusive editing features!
        </div>
      )}
    </>
  );
};
