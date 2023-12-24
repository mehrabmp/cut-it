import { headers } from "next/headers";
import { db } from "~/server/db";

import { LinkCard } from "./link-card";

export const LinkList = async () => {
  headers();

  const links = await db.query.links.findMany({});

  return (
    <div className="flex w-full flex-col gap-2">
      {links.map((link) => (
        <LinkCard key={link.id} {...link} />
      ))}
    </div>
  );
};
