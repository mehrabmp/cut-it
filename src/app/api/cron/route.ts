import { NextResponse, type NextRequest } from "next/server";
import { deleteExpiredLinks } from "~/server/api/link";
import { deleteExpiredUserLinks } from "~/server/api/user-link";

function isAuthorized(req: NextRequest): boolean {
  return (
    req.headers.get("Authorization") === `Bearer ${process.env.CRON_SECRET}`
  );
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await deleteExpiredUserLinks();
  await deleteExpiredLinks();

  return NextResponse.json({ message: "success" });
}
