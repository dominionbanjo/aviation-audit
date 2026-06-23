import { db } from "@/lib/db";
import {
  auditTemplates,
  auditCategories,
  auditQuestions,
  users,
} from "@/lib/db/schema";
import { eq, desc, sql, ilike } from "drizzle-orm";
import type {
  AuditTemplate,
} from "@/lib/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────
export type QuestionInput = { id?: string; query: string; manualRef?: string; orderIndex: number };
export type CategoryInput = { id?: string; name: string; orderIndex: number; questions: QuestionInput[] };

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
  const rows = await db
    .select({
      id: auditTemplates.id,
      name: auditTemplates.name,
      locationType: auditTemplates.locationType,
      regulatoryBase: auditTemplates.regulatoryBase,
      createdBy: auditTemplates.createdBy,
      createdAt: auditTemplates.createdAt,
      updatedAt: auditTemplates.updatedAt,
      creatorName: users.name,
      creatorEmail: users.email,
      categoryCount: sql<number>`count(distinct ${auditCategories.id})`.mapWith(Number),
      questionCount: sql<number>`count(${auditQuestions.id})`.mapWith(Number),
    })
    .from(auditTemplates)
    .leftJoin(users, eq(users.id, auditTemplates.createdBy))
    .leftJoin(auditCategories, eq(auditCategories.templateId, auditTemplates.id))
    .leftJoin(auditQuestions, eq(auditQuestions.templateId, auditTemplates.id))
    .groupBy(auditTemplates.id, users.name, users.email)
    .orderBy(desc(auditTemplates.createdAt));

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    locationType: r.locationType,
    regulatoryBase: r.regulatoryBase,
    createdBy: r.createdBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    creator: r.creatorEmail ? { name: r.creatorName, email: r.creatorEmail } : null,
    categoryCount: Number(r.categoryCount),
    questionCount: Number(r.questionCount),
  })) ;
}

export async function getTemplatesPaginated(options: { limit: number; offset: number; search?: string }): Promise<{ rows: TemplateWithMeta[]; total: number }> {
  let countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(auditTemplates)
    .$dynamic();

  let query = db
    .select({
      id: auditTemplates.id,
      name: auditTemplates.name,
      locationType: auditTemplates.locationType,
      regulatoryBase: auditTemplates.regulatoryBase,
      createdBy: auditTemplates.createdBy,
      createdAt: auditTemplates.createdAt,
      updatedAt: auditTemplates.updatedAt,
      creatorName: users.name,
      creatorEmail: users.email,
      categoryCount: sql<number>`count(distinct ${auditCategories.id})`.mapWith(Number),
      questionCount: sql<number>`count(${auditQuestions.id})`.mapWith(Number),
    })
    .from(auditTemplates)
    .leftJoin(users, eq(users.id, auditTemplates.createdBy))
    .leftJoin(auditCategories, eq(auditCategories.templateId, auditTemplates.id))
    .leftJoin(auditQuestions, eq(auditQuestions.templateId, auditTemplates.id))
    .groupBy(auditTemplates.id, users.name, users.email)
    .$dynamic();

  if (options.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(ilike(auditTemplates.name, searchPattern));
    countQuery = countQuery.where(ilike(auditTemplates.name, searchPattern));
  }

  const [{ count }] = await countQuery;
  const rows = await query
    .orderBy(desc(auditTemplates.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const formattedRows: TemplateWithMeta[] = rows.map(r => ({
    id: r.id,
    name: r.name,
    locationType: r.locationType,
    regulatoryBase: r.regulatoryBase,
    createdBy: r.createdBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    creator: r.creatorEmail ? { name: r.creatorName, email: r.creatorEmail } : null,
    categoryCount: Number(r.categoryCount),
    questionCount: Number(r.questionCount),
  }));

  return { rows: formattedRows, total: Number(count || 0) };
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

    // 2. Fetch existing categories and questions to diff
    const currentCategories = await tx.query.auditCategories.findMany({
      where: eq(auditCategories.templateId, id),
      with: { questions: true }
    });

    const currentCatIds = currentCategories.map(c => c.id);
    const incomingCatIds = categories.map(c => c.id).filter((cid): cid is string => Boolean(cid));

    // 3. Delete removed categories
    const catsToDelete = currentCatIds.filter(cid => !incomingCatIds.includes(cid));
    if (catsToDelete.length > 0) {
      await tx.delete(auditCategories).where(sql`${auditCategories.id} IN ${catsToDelete}`);
    }

    // 4. Process incoming categories
    for (const cat of categories) {
      let categoryId = cat.id;

      if (cat.id) {
        // Update existing category
        await tx.update(auditCategories)
          .set({ name: cat.name, orderIndex: cat.orderIndex })
          .where(eq(auditCategories.id, cat.id));
      } else {
        // Insert new category
        const [newCat] = await tx.insert(auditCategories)
          .values({ templateId: id, name: cat.name, orderIndex: cat.orderIndex })
          .returning({ id: auditCategories.id });
        categoryId = newCat.id;
      }

      // Diff questions within this category
      const currentQuestions = currentCategories.find(c => c.id === categoryId)?.questions ?? [];
      const currentQuestIds = currentQuestions.map(q => q.id);
      const incomingQuestIds = cat.questions.map(q => q.id).filter((qid): qid is string => Boolean(qid));

      // Delete removed questions
      const questsToDelete = currentQuestIds.filter(qid => !incomingQuestIds.includes(qid));
      if (questsToDelete.length > 0) {
        await tx.delete(auditQuestions).where(sql`${auditQuestions.id} IN ${questsToDelete}`);
      }

      // Update/Insert questions
      for (const q of cat.questions) {
        if (q.id) {
          await tx.update(auditQuestions)
            .set({ query: q.query, manualRef: q.manualRef ?? null, orderIndex: q.orderIndex })
            .where(eq(auditQuestions.id, q.id));
        } else {
          await tx.insert(auditQuestions).values({
            templateId: id,
            categoryId: categoryId as string,
            query: q.query,
            manualRef: q.manualRef ?? null,
            orderIndex: q.orderIndex
          });
        }
      }
    }
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function getAuditTemplatesStats() {
  const [{ count: totalTemplates }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditTemplates);

  const [{ count: totalQuestions }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditQuestions);

  const avg = Number(totalTemplates) > 0 ? Math.round(Number(totalQuestions) / Number(totalTemplates)) : 0;

  return {
    totalTemplates: Number(totalTemplates),
    totalQuestions: Number(totalQuestions),
    averageQuestionsPerTemplate: avg,
  };
}
