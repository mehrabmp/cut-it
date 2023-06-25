import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export const LinkList = async () => {
  const links = await db.query.links.findMany({
    with: {
      user: true,
    },
  });

  return (
    <ul>
      {links.map((link) => (
        <li key={link.id} className="">
          <h2>{link.key}</h2>
        </li>
      ))}
    </ul>
  );
};
