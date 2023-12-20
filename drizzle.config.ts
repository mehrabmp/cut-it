import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_URL ?? "",
    authToken: env.TURSO_AUTH_TOKEN,
    // url: "file:./local.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
