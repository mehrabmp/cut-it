import { db } from "@/server/db";
import { LinkCard } from "./link-card";

export const dynamic = "force-dynamic";

export const LinkList = async () => {
  const links = await db.query.links.findMany({});

  return (
    <ul className="flex w-72 flex-col gap-2">
      {links.map((link) => (
        <li key={link.id} className="w-full">
          <LinkCard {...link} />
        </li>
      ))}
    </ul>
  );
};
