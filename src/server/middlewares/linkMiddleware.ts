import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { linkItems } from "~/server/db/schema";
import { redis } from "~/server/redis";
import { eq, sql } from "drizzle-orm";

export const linkMiddleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const slug = decodeURIComponent(pathname.substring(1));

  if (!slug) return NextResponse.next();

  const [url] = await Promise.all([
    redis.get<string>(slug),
    db
      .update(linkItems)
      .set({ views: sql`${linkItems.views} + 1` })
      .where(eq(linkItems.slug, slug))
      .run(),
  ]);

  if (!url) return NextResponse.next();

  return NextResponse.redirect(new URL(decodeURIComponent(url)));
};
