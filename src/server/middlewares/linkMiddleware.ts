import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redis } from "@/server/redis";

export default async function linkMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const slug = decodeURIComponent(pathname.substring(1));

  const url = await redis.get<string>(slug);
  if (!url) return NextResponse.next();

  return NextResponse.redirect(new URL(decodeURIComponent(url)));
}
