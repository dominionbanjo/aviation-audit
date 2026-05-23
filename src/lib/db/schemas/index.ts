// ─── Schema Barrel Export ──────────────────────────────────────────────────
// Import each domain schema file and re-export everything so that consumers
// can always use: import { ... } from "@/lib/db/schemas"

export * from "./users";
export * from "./audit-templates";
export * from "./audits";
export * from "./otp";
