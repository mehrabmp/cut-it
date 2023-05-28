import type { Config } from "drizzle-kit";

export default {
  connectionString: process.env.POSTGRES_URL,
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
} satisfies Config;
