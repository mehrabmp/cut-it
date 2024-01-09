import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { linkMiddleware } from "~/server/middlewares";
import { ratelimit } from "~/server/redis";

export async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  const { success, pending } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`,
  );
  event.waitUntil(pending);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return linkMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
