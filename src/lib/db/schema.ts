// ─── Drizzle Schema Root ──────────────────────────────────────────────────────
// This file is the single entrypoint for ALL database schemas.
// Individual schema definitions live in ./schemas/* and are re-exported here.
// Drizzle Kit's config points at THIS file via schema: "./src/lib/db/schema.ts"
export * from "./schemas";
