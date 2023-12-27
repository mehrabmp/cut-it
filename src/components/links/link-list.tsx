import { cookies } from "next/headers";
import { getShortLinksByLinkId } from "~/server/api/link";

import { LinkCard } from "./link-card";

export const LinkList = async () => {
  const cookieStore = cookies();
  const linkId = cookieStore.get("link-id");

  if (!linkId) {
    return null;
  }

  const shortLinks = await getShortLinksByLinkId(linkId.value);

  return (
    <div className="flex w-full flex-col gap-2">
      {shortLinks.map((link) => (
        <LinkCard key={link.id} {...link} />
      ))}
    </div>
  );
};
