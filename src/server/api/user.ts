import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { type UserWithLink } from "~/types";

export async function getUserById(
  id: string,
): Promise<UserWithLink | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      userLink: true,
    },
  });
  return user;
}
