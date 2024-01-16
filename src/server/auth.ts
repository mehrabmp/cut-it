import { cookies } from "next/headers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { env } from "~/env";
import {
  getLinksByUserLinkId,
  updateLinksByUserLinkId,
} from "~/server/api/link";
import {
  createNewUserLink,
  getUserLinkById,
  getUserLinkByUserId,
  updateUserLink,
} from "~/server/api/user-link";
import { db } from "~/server/db";
import { redis } from "~/server/redis";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    async signIn({ user }) {
      const cookieStore = cookies();
      const userLinkIdCookie = cookieStore.get("user-link-id")?.value;

      if (!userLinkIdCookie) return;

      const existingUserLink = await getUserLinkByUserId(user.id);

      if (existingUserLink) {
        const links = await getLinksByUserLinkId(userLinkIdCookie);

        const promises = links.map((link) =>
          redis.persist(link.slug.toLowerCase()),
        );

        await Promise.allSettled([
          ...promises,
          updateLinksByUserLinkId(userLinkIdCookie, {
            userLinkId: existingUserLink.id,
          }),
        ]);
      } else {
        const userLink = await getUserLinkById(userLinkIdCookie);

        if (userLink) {
          const promises = userLink.links.map((link) =>
            redis.persist(link.slug.toLowerCase()),
          );

          await Promise.allSettled([
            ...promises,
            updateUserLink(userLinkIdCookie, { userId: user.id }),
          ]);
        } else {
          await createNewUserLink(user.id);
        }
      }
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      cookies().delete("user-link-id");
    },
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
