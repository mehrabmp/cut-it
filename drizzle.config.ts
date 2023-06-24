import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL ?? "",
    authToken: process.env.TURSO_AUTH_TOKEN,
    // url: "file:./local.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
