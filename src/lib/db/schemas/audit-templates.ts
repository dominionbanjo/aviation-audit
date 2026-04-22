import { pgTable, uuid, timestamp, text, integer, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";

// ─── Audit Templates ────────────────────────────────────────────────────────
export const auditTemplates = pgTable("audit_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  locationType: varchar("location_type").notNull(),
  regulatoryBase: varchar("regulatory_base").notNull(),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


// ─── Template Categories ─────────────────────────────────────────────────────
export const auditCategories = pgTable("audit_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => auditTemplates.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});


// ─── Template Questions ──────────────────────────────────────────────────────
export const auditQuestions = pgTable("audit_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => auditTemplates.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => auditCategories.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  manualRef: varchar("manual_ref"),
  orderIndex: integer("order_index").notNull().default(0),
});


// ─── Relations ─────────────────────────────────────────────────────────────────
export const auditTemplatesRelations = relations(auditTemplates, ({ many, one }) => ({
  categories: many(auditCategories),
  questions: many(auditQuestions),
  creator: one(users, {
    fields: [auditTemplates.createdBy],
    references: [users.id],
  }),
}));

export const auditCategoriesRelations = relations(auditCategories, ({ one, many }) => ({
  template: one(auditTemplates, {
    fields: [auditCategories.templateId],
    references: [auditTemplates.id],
  }),
  questions: many(auditQuestions),
}));

export const auditQuestionsRelations = relations(auditQuestions, ({ one }) => ({
  category: one(auditCategories, {
    fields: [auditQuestions.categoryId],
    references: [auditCategories.id],
  }),
  template: one(auditTemplates, {
    fields: [auditQuestions.templateId],
    references: [auditTemplates.id],
  }),
}));


// ─── Types ────────────────────────────────────────────────────────────────────
export type AuditTemplate = typeof auditTemplates.$inferSelect;
export type InsertAuditTemplate = typeof auditTemplates.$inferInsert;

export type AuditCategory = typeof auditCategories.$inferSelect;
export type InsertAuditCategory = typeof auditCategories.$inferInsert;

export type AuditQuestion = typeof auditQuestions.$inferSelect;
export type InsertAuditQuestion = typeof auditQuestions.$inferInsert;
