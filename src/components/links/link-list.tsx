import { cookies } from "next/headers";
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
    <div className="flex w-full flex-col gap-2">
      {shortLinks.map((link) => (
        <LinkCard key={link.slug} {...link} />
      ))}
    </div>
  );
};
