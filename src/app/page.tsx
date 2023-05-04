import { db } from "@/server/db";
import { links } from "@/server/db/schema";
import Link from "next/link";

export default async function Home() {
  const data = await db.select().from(links);

  return (
    <main className="">
      <ul>
        {data.map((link) => (
          <Link key={link.id} href={link.url}>
            {link.title}{" "}
          </Link>
        ))}
      </ul>
    </main>
  );
}
