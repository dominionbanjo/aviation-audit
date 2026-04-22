import { pgTable, varchar, timestamp, text, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users Table ──────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").notNull(),
  name: varchar("name"),
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// ─── Audit Templates ────────────────────────────────────────────────────────
export const auditTemplates = pgTable("audit_templates", {
  id: varchar("id").primaryKey(), // Using string IDs (e.g. cuuid or random UUID)
  name: varchar("name").notNull(),
  locationType: varchar("location_type").notNull(),
  regulatoryBase: varchar("regulatory_base").notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const auditTemplatesRelations = relations(auditTemplates, ({ many, one }) => ({
  categories: many(auditCategories),
  creator: one(users, {
    fields: [auditTemplates.createdBy],
    references: [users.id],
  }),
}));


// ─── Template Categories ─────────────────────────────────────────────────────
export const auditCategories = pgTable("audit_categories", {
  id: varchar("id").primaryKey(),
  templateId: varchar("template_id").notNull().references(() => auditTemplates.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const auditCategoriesRelations = relations(auditCategories, ({ one, many }) => ({
  template: one(auditTemplates, {
    fields: [auditCategories.templateId],
    references: [auditTemplates.id],
  }),
  questions: many(auditQuestions),
}));


// ─── Template Questions ──────────────────────────────────────────────────────
export const auditQuestions = pgTable("audit_questions", {
  id: varchar("id").primaryKey(),
  categoryId: varchar("category_id").notNull().references(() => auditCategories.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  manualRef: varchar("manual_ref"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const auditQuestionsRelations = relations(auditQuestions, ({ one }) => ({
  category: one(auditCategories, {
    fields: [auditQuestions.categoryId],
    references: [auditCategories.id],
  }),
}));


// ─── Submitted Audits ────────────────────────────────────────────────────────
export const audits = pgTable("audits", {
  id: varchar("id").primaryKey(),
  refNo: varchar("ref_no").notNull().unique(), // e.g., AD-20240422-0001
  templateId: varchar("template_id").notNull().references(() => auditTemplates.id),
  auditorId: varchar("auditor_id").notNull().references(() => users.id),
  location: varchar("location").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: varchar("status").notNull().default("in-progress"), // 'in-progress' or 'completed'
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const auditsRelations = relations(audits, ({ one, many }) => ({
  template: one(auditTemplates, {
    fields: [audits.templateId],
    references: [auditTemplates.id],
  }),
  auditor: one(users, {
    fields: [audits.auditorId],
    references: [users.id],
  }),
  responses: many(auditResponses),
}));


// ─── Audit Responses ─────────────────────────────────────────────────────────
export const auditResponses = pgTable("audit_responses", {
  id: varchar("id").primaryKey(),
  auditId: varchar("audit_id").notNull().references(() => audits.id, { onDelete: "cascade" }),
  questionId: varchar("question_id").notNull().references(() => auditQuestions.id),
  responseValue: varchar("response_value"), // 'SAT', 'UNSAT', 'N/A'
  comment: text("comment"),
});

export const auditResponsesRelations = relations(auditResponses, ({ one }) => ({
  audit: one(audits, {
    fields: [auditResponses.auditId],
    references: [audits.id],
  }),
  question: one(auditQuestions, {
    fields: [auditResponses.questionId],
    references: [auditQuestions.id],
  }),
}));

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type AuditTemplate = typeof auditTemplates.$inferSelect;
export type InsertAuditTemplate = typeof auditTemplates.$inferInsert;

export type AuditCategory = typeof auditCategories.$inferSelect;
export type InsertAuditCategory = typeof auditCategories.$inferInsert;

export type AuditQuestion = typeof auditQuestions.$inferSelect;
export type InsertAuditQuestion = typeof auditQuestions.$inferInsert;

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

export type AuditResponse = typeof auditResponses.$inferSelect;
export type InsertAuditResponse = typeof auditResponses.$inferInsert;
