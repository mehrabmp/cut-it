import type { Config } from "drizzle-kit";
import { env } from "@/env.mjs";

export default {
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
} satisfies Config;
