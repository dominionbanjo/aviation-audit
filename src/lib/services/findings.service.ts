import { db } from "@/lib/db";
import { audits, auditResponses, auditQuestions, auditCategories, auditTemplates, users } from "@/lib/db/schema";
import { eq, sql, and, desc, or, ilike } from "drizzle-orm";
import type { AuditResponse } from "@/lib/db/schema";

export interface RichFinding {
  id: string;
  auditId: string;
  auditRefNo: string;
  auditLocation: string;
  auditDate: Date;
  auditorName: string | null;
  templateName: string;
  categoryName: string;
  questionQuery: string;
  questionManualRef: string | null;
  questionSeverity: string;
  comment: string | null;
  createdAt: Date;
  
  rootCause: string | null;
  correctiveAction: string | null;
  responsiblePerson: string | null;
  deadline: Date | null;
  findingStatus: "open" | "under-review" | "closed";
  resolvedAt: Date | null;
}

export async function getFindingsPaginated(options: { limit: number; offset: number; search?: string }): Promise<{ rows: RichFinding[]; total: number }> {
  let countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(auditResponses)
    .innerJoin(audits, eq(audits.id, auditResponses.auditId))
    .innerJoin(auditQuestions, eq(auditQuestions.id, auditResponses.questionId))
    .innerJoin(auditCategories, eq(auditCategories.id, auditQuestions.categoryId))
    .innerJoin(auditTemplates, eq(auditTemplates.id, audits.templateId))
    .where(eq(auditResponses.responseValue, "UNSAT"))
    .$dynamic();

  let query = db
    .select({
      id: auditResponses.id,
      auditId: auditResponses.auditId,
      auditRefNo: audits.refNo,
      auditLocation: audits.location,
      auditDate: audits.date,
      auditorName: users.name,
      templateName: auditTemplates.name,
      categoryName: auditCategories.name,
      questionQuery: auditQuestions.query,
      questionManualRef: auditQuestions.manualRef,
      questionSeverity: auditQuestions.severity,
      comment: auditResponses.comment,
      createdAt: auditResponses.createdAt,
      rootCause: auditResponses.rootCause,
      correctiveAction: auditResponses.correctiveAction,
      responsiblePerson: auditResponses.responsiblePerson,
      deadline: auditResponses.deadline,
      findingStatus: auditResponses.findingStatus,
      resolvedAt: auditResponses.resolvedAt,
    })
    .from(auditResponses)
    .innerJoin(audits, eq(audits.id, auditResponses.auditId))
    .innerJoin(auditQuestions, eq(auditQuestions.id, auditResponses.questionId))
    .innerJoin(auditCategories, eq(auditCategories.id, auditQuestions.categoryId))
    .innerJoin(auditTemplates, eq(auditTemplates.id, audits.templateId))
    .leftJoin(users, eq(users.id, audits.auditorId))
    .where(eq(auditResponses.responseValue, "UNSAT"))
    .$dynamic();

  if (options.search) {
    const searchPattern = `%${options.search}%`;
    const filter = or(
      ilike(audits.refNo, searchPattern),
      ilike(audits.location, searchPattern),
      ilike(auditCategories.name, searchPattern)
    );
    query = query.where(and(eq(auditResponses.responseValue, "UNSAT"), filter));
    countQuery = countQuery.where(and(eq(auditResponses.responseValue, "UNSAT"), filter));
  }

  const [{ count }] = await countQuery;

  const rows = await query
    .orderBy(desc(auditResponses.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const formattedRows: RichFinding[] = rows.map(r => ({
    ...r,
    findingStatus: (r.findingStatus || "open") as "open" | "under-review" | "closed",
  }));

  return { rows: formattedRows, total: Number(count || 0) };
}

// ─── Get All Findings (UNSAT Responses) ────────────────────────────────────────
export async function getFindings(): Promise<RichFinding[]> {
  const rows = await db
    .select({
      id: auditResponses.id,
      auditId: auditResponses.auditId,
      auditRefNo: audits.refNo,
      auditLocation: audits.location,
      auditDate: audits.date,
      auditorName: users.name,
      templateName: auditTemplates.name,
      categoryName: auditCategories.name,
      questionQuery: auditQuestions.query,
      questionManualRef: auditQuestions.manualRef,
      questionSeverity: auditQuestions.severity,
      comment: auditResponses.comment,
      createdAt: auditResponses.createdAt,
      rootCause: auditResponses.rootCause,
      correctiveAction: auditResponses.correctiveAction,
      responsiblePerson: auditResponses.responsiblePerson,
      deadline: auditResponses.deadline,
      findingStatus: auditResponses.findingStatus,
      resolvedAt: auditResponses.resolvedAt,
    })
    .from(auditResponses)
    .innerJoin(audits, eq(audits.id, auditResponses.auditId))
    .innerJoin(auditQuestions, eq(auditQuestions.id, auditResponses.questionId))
    .innerJoin(auditCategories, eq(auditCategories.id, auditQuestions.categoryId))
    .innerJoin(auditTemplates, eq(auditTemplates.id, audits.templateId))
    .leftJoin(users, eq(users.id, audits.auditorId))
    .where(eq(auditResponses.responseValue, "UNSAT"))
    .orderBy(desc(auditResponses.createdAt));

  // Cast findingStatus to the literal type
  return rows.map(r => ({
    ...r,
    findingStatus: (r.findingStatus || "open") as "open" | "under-review" | "closed",
  }));
}

// ─── Get Findings Statistics ──────────────────────────────────────────────────
export async function getFindingStats() {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(auditResponses)
    .where(eq(auditResponses.responseValue, "UNSAT"));

  const [{ open }] = await db
    .select({ open: sql<number>`count(*)` })
    .from(auditResponses)
    .where(and(
      eq(auditResponses.responseValue, "UNSAT"),
      eq(auditResponses.findingStatus, "open")
    ));

  const [{ underReview }] = await db
    .select({ underReview: sql<number>`count(*)` })
    .from(auditResponses)
    .where(and(
      eq(auditResponses.responseValue, "UNSAT"),
      eq(auditResponses.findingStatus, "under-review")
    ));

  const [{ closed }] = await db
    .select({ closed: sql<number>`count(*)` })
    .from(auditResponses)
    .where(and(
      eq(auditResponses.responseValue, "UNSAT"),
      eq(auditResponses.findingStatus, "closed")
    ));

  const [{ critical }] = await db
    .select({ critical: sql<number>`count(*)` })
    .from(auditResponses)
    .innerJoin(auditQuestions, eq(auditQuestions.id, auditResponses.questionId))
    .where(and(
      eq(auditResponses.responseValue, "UNSAT"),
      eq(auditQuestions.severity, "Critical")
    ));

  // Compute compliance score
  const [{ sat }] = await db
    .select({ sat: sql<number>`count(*)` })
    .from(auditResponses)
    .where(eq(auditResponses.responseValue, "SAT"));

  const satCount = Number(sat || 0);
  const unsatCount = Number(total || 0);
  const complianceScore = (satCount + unsatCount) > 0 
    ? Math.round((satCount / (satCount + unsatCount)) * 100) 
    : 100;

  return {
    totalFindings: Number(total || 0),
    openFindings: Number(open || 0),
    underReviewFindings: Number(underReview || 0),
    closedFindings: Number(closed || 0),
    criticalFindings: Number(critical || 0),
    complianceScore: `${complianceScore}%`,
  };
}

// ─── Update Findings CAR Details ──────────────────────────────────────────────
export async function updateFinding(
  id: string,
  payload: {
    rootCause?: string;
    correctiveAction?: string;
    responsiblePerson?: string;
    deadline?: Date | string | null;
    findingStatus?: "open" | "under-review" | "closed";
  }
): Promise<void> {
  const updates: Record<string, any> = { ...payload };

  if (payload.deadline) {
    updates.deadline = new Date(payload.deadline);
  } else if (payload.deadline === null) {
    updates.deadline = null;
  }

  if (payload.findingStatus === "closed") {
    updates.resolvedAt = new Date();
  } else if (payload.findingStatus) {
    updates.resolvedAt = null;
  }

  await db
    .update(auditResponses)
    .set(updates)
    .where(eq(auditResponses.id, id));
}
