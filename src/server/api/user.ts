import { db } from "~/server/db";
import { users, type User } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
}
