import { headers } from "next/headers";
import { db } from "~/server/db";

import { LinkCard } from "./link-card";

export const LinkList = async () => {
  headers();

  const links = await db.query.links.findMany({});

  return (
    <ul className="flex w-full flex-col gap-2">
      {links.map((link) => (
        <li key={link.id} className="w-full">
          <LinkCard {...link} />
        </li>
      ))}
    </ul>
  );
};
