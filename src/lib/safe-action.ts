import { getServerAuthSession } from "~/server/auth";
import { createSafeActionClient } from "next-safe-action";

export class MyCustomError extends Error {}

export const action = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof MyCustomError) {
      return e.message;
    }

    return "Internal Server Error";
  },
});

export const authAction = createSafeActionClient({
  async middleware() {
    const session = await getServerAuthSession();

    if (!session) {
      throw new Error("Session not found!");
    }

    return { user: session.user };
  },
  handleReturnedServerError(e) {
    if (e instanceof MyCustomError) {
      return e.message;
    }

    return "Internal Server Error";
  },
});
