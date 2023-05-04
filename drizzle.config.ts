import { type Config } from "drizzle-kit";

export default {
  out: "./src/server/db/migrations",
  schema: "./src/server/db/schema.ts",
  breakpoints: false,
} satisfies Config;
