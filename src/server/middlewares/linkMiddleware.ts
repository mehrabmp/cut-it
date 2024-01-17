import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { links } from "~/server/db/schema";
import { redis } from "~/server/redis";
import { eq, sql } from "drizzle-orm";

export const linkMiddleware = async (req: NextRequest) => {
  const pathname = decodeURIComponent(req.nextUrl.pathname);

  // Check if the request is for the home page or not a shortened URL
  if (pathname === "/" || pathname.split("/").length > 2) {
    return NextResponse.next();
  }

  const slug = pathname.split("/")[1] ?? "";

  const [url] = await Promise.all([
    redis.get<string>(slug.toLowerCase()),
    db
      .update(links)
      .set({ clicks: sql`${links.clicks} + 1` })
      .where(eq(links.slug, slug))
      .run(),
  ]);

  if (!url) return NextResponse.next();

  return NextResponse.redirect(new URL(decodeURIComponent(url)));
};
