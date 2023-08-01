import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "@/env.mjs";
import * as schema from "./schema";

const client = createClient({
  url: env.TURSO_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });
