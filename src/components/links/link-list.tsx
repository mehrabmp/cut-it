import { cookies } from "next/headers";
import { getLinksByUserLinkId } from "~/server/api/link";
import { getServerAuthSession } from "~/server/auth";

import { SigninDialog } from "../auth/signin-dialog";
import { LinkCard } from "./link-card";

export const LinkList = async () => {
  const session = await getServerAuthSession();
  const cookieStore = cookies();

  const user = session?.user;
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
      {!user && shortLinks.length > 0 && (
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
