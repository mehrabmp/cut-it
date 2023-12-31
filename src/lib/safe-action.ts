import { getServerAuthSession } from "~/server/auth";
import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient();

export const authAction = createSafeActionClient({
  async middleware() {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Session not found!");
    }

    return { user: session.user };
  },
});
