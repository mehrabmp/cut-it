import { env } from "~/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;
