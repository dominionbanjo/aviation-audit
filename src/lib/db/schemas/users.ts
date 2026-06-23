import { pgTable, varchar, timestamp, pgEnum, index, boolean } from "drizzle-orm/pg-core";

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
  banned: boolean("banned").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index("idx_users_email").on(table.email),
    nameIdx: index("idx_users_name").on(table.name),
  };
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
