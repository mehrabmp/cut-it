import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redis } from "@/server/redis";
import { db } from "@/server/db";
import { links } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export default async function linkMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const slug = decodeURIComponent(pathname.substring(1));

  const [url] = await Promise.all([
    redis.get<string>(slug),
    db
      .update(links)
      .set({ viewCount: sql`${links.viewCount} + 1` })
      .where(eq(links.slug, slug))
      .run(),
  ]);

  if (!url) return NextResponse.next();

  return NextResponse.redirect(new URL(decodeURIComponent(url)));
}
