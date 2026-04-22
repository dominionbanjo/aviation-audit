import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "MANAGER",
  "LEAD_AUDITOR",
  "AUDITOR",
  "USER",
]);

// ─── Users Table ──────────────────────────────────────────────────────────────
// Synced from Neon Auth — id comes from the auth provider (no DB-generated UUID needed here)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Neon Auth provides this ID
  email: varchar("email").notNull(),
  name: varchar("name"),
  role: userRoleEnum("role").default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
