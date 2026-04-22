import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// The raw neon http function (still exported for Neon Auth compatibility)
export const sql = neon(process.env.DATABASE_URL);

// The Drizzle ORM db instance — use this for all application queries
export const db = drizzle(sql, { schema });
