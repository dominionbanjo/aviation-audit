import { db } from "@/lib/db";
import {
  auditTemplates,
  auditCategories,
  auditQuestions,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type {
  AuditTemplate,
  InsertAuditTemplate,
  AuditCategory,
  AuditQuestion,
} from "@/lib/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────
export type QuestionInput = { query: string; manualRef?: string; orderIndex: number };
export type CategoryInput = { name: string; orderIndex: number; questions: QuestionInput[] };

export interface CreateTemplatePayload {
  name: string;
  locationType: string;
  regulatoryBase: string;
  createdBy: string;           // authenticated user ID from session
  categories: CategoryInput[];
}

export type TemplateWithMeta = AuditTemplate & {
  creator: { name: string | null; email: string } | null;
  categoryCount: number;
  questionCount: number;
};


// ─── List All Templates ────────────────────────────────────────────────────────
export async function getTemplates(): Promise<TemplateWithMeta[]> {
  const rows = await db.query.auditTemplates.findMany({
    orderBy: [desc(auditTemplates.createdAt)],
    with: {
      creator: { columns: { name: true, email: true } },
      categories: {
        with: { questions: { columns: { id: true } } },
        columns: { id: true },
      },
    },
  });

  return rows.map((t) => ({
    ...t,
    creator: t.creator ?? null,
    categoryCount: t.categories.length,
    questionCount: t.categories.reduce(
      (sum, cat) => sum + cat.questions.length,
      0
    ),
  }));
}


// ─── Get Single Template with Full Nested Data ────────────────────────────────
export async function getTemplateById(id: string) {
  return db.query.auditTemplates.findFirst({
    where: eq(auditTemplates.id, id),
    with: {
      creator: { columns: { name: true, email: true } },
      categories: {
        orderBy: [auditCategories.orderIndex],
        with: {
          questions: {
            orderBy: [auditQuestions.orderIndex],
          },
        },
      },
    },
  });
}


// ─── Create Template (transactional) ─────────────────────────────────────────
export async function createTemplate(payload: CreateTemplatePayload): Promise<string> {
  const { name, locationType, regulatoryBase, createdBy, categories } = payload;

  return db.transaction(async (tx) => {
    // 1. Insert template — DB generates UUID via gen_random_uuid()
    const [template] = await tx
      .insert(auditTemplates)
      .values({ name, locationType, regulatoryBase, createdBy })
      .returning({ id: auditTemplates.id });

    // 2. For each category, insert and then insert its questions
    for (const cat of categories) {
      const [category] = await tx
        .insert(auditCategories)
        .values({
          templateId: template.id,
          name: cat.name,
          orderIndex: cat.orderIndex,
        })
        .returning({ id: auditCategories.id });

      if (cat.questions.length > 0) {
        await tx.insert(auditQuestions).values(
          cat.questions.map((q) => ({
            templateId: template.id,
            categoryId: category.id,
            query: q.query,
            manualRef: q.manualRef ?? null,
            orderIndex: q.orderIndex,
          }))
        );
      }
    }

    return template.id;
  });
}


// ─── Delete Template ──────────────────────────────────────────────────────────
export async function deleteTemplate(id: string): Promise<void> {
  await db.delete(auditTemplates).where(eq(auditTemplates.id, id));
}

// ─── Update Template (transactional sync of categories/questions) ─────────────
export async function updateTemplate(
  id: string,
  payload: {
    name: string;
    locationType: string;
    regulatoryBase: string;
    categories: CategoryInput[];
  }
): Promise<void> {
  const { name, locationType, regulatoryBase, categories } = payload;

  await db.transaction(async (tx) => {
    // 1. Update basic template info
    await tx
      .update(auditTemplates)
      .set({ name, locationType, regulatoryBase, updatedAt: new Date() })
      .where(eq(auditTemplates.id, id));

    // 2. Delete existing categories (Cascade deletes questions)
    await tx.delete(auditCategories).where(eq(auditCategories.templateId, id));

    // 3. Re-insert new categories and questions
    for (const cat of categories) {
      const [category] = await tx
        .insert(auditCategories)
        .values({
          templateId: id,
          name: cat.name,
          orderIndex: cat.orderIndex,
        })
        .returning({ id: auditCategories.id });

      if (cat.questions.length > 0) {
        await tx.insert(auditQuestions).values(
          cat.questions.map((q) => ({
            templateId: id,
            categoryId: category.id,
            query: q.query,
            manualRef: q.manualRef ?? null,
            orderIndex: q.orderIndex,
          }))
        );
      }
    }
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function getAuditTemplatesStats() {
  const templates = await db.select().from(auditTemplates);
  const questions = await db.select().from(auditQuestions);

  const totalTemplates = templates.length;
  const totalQuestions = questions.length;
  const averageQuestionsPerTemplate = totalTemplates > 0 ? Math.round(totalQuestions / totalTemplates) : 0;

  return {
    totalTemplates,
    totalQuestions,
    averageQuestionsPerTemplate,
  };
}
