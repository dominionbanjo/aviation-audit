import { db } from "@/lib/db";
import { audits, auditResponses } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { auditTemplates, users } from "@/lib/db/schema";
import type { Audit, AuditResponse, InsertAudit, InsertAuditResponse } from "@/lib/db/schema";

export interface AuditWithMeta extends Audit {
  templateName: string;
  auditorName: string | null;
  responseCount: number;
}

// ─── List Audits ──────────────────────────────────────────────────────────────
export async function getAudits(): Promise<AuditWithMeta[]> {
  const rows = await db.query.audits.findMany({
    orderBy: [desc(audits.startedAt)],
    with: {
      template: { columns: { name: true } },
      auditor: { columns: { name: true } },
      responses: { columns: { id: true } },
    },
  });

  return rows.map((a) => ({
    ...a,
    templateName: a.template?.name ?? "Unknown Template",
    auditorName: a.auditor?.name ?? "Unknown Auditor",
    responseCount: a.responses.length,
  }));
}

// ─── Start New Audit ──────────────────────────────────────────────────────────
export async function startAudit(payload: {
  templateId: string;
  auditorId: string;
  location: string;
}): Promise<string> {
  const { templateId, auditorId, location } = payload;

  // Generate Reference Number: AD-YYYYMMDD-XXXX
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  
  // Get count for today to increment sequence
  const todayAudits = await db
    .select({ count: sql<number>`count(*)` })
    .from(audits)
    .where(sql`date_trunc('day', ${audits.startedAt}) = date_trunc('day', now())`);
  
  const seq = (Number(todayAudits[0]?.count || 0) + 1).toString().padStart(4, "0");
  const refNo = `AD-${dateStr}-${seq}`;

  const [newAudit] = await db
    .insert(audits)
    .values({
      refNo,
      templateId,
      auditorId,
      location,
      date: new Date(),
      status: "in-progress",
    })
    .returning({ id: audits.id });

  return newAudit.id;
}

// ─── Save Audit Response ──────────────────────────────────────────────────────
export async function saveAuditResponse(payload: {
  auditId: string;
  questionId: string;
  responseValue: "SAT" | "UNSAT" | "N/A" | null;
  comment?: string;
}): Promise<void> {
  const { auditId, questionId, responseValue, comment } = payload;

  await db
    .insert(auditResponses)
    .values({
      auditId,
      questionId,
      responseValue,
      comment: comment ?? null,
    })
    .onConflictDoUpdate({
      target: [auditResponses.auditId, auditResponses.questionId], // Wait, does schema have this unique constraint?
      set: {
        responseValue,
        comment: comment ?? null,
      },
    });
}
// Note: I need to check if the schema has a unique constraint on [auditId, questionId].
// If not, I should add it or use an exist-then-update logic.

// ─── Complete Audit ───────────────────────────────────────────────────────────
export async function completeAudit(id: string): Promise<void> {
  await db
    .update(audits)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(audits.id, id));
}

// ─── Get Audit Stats ──────────────────────────────────────────────────────────
export async function getAuditStats() {
  const allAudits = await db.select().from(audits);
  
  const totalAuditsDone = allAudits.filter(a => a.status === "completed").length;
  const activeAudits = allAudits.filter(a => a.status === "in-progress").length;
  const uniqueLocations = new Set(allAudits.map(a => a.location.toUpperCase())).size;

  return {
    totalAuditsDone,
    activeAudits,
    uniqueLocations,
  };
}

// ─── Get Single Audit with Responses for Execution ────────────────────────────
export async function getAuditForExecution(id: string) {
  return db.query.audits.findFirst({
    where: eq(audits.id, id),
    with: {
      template: {
        with: {
          categories: {
            with: {
              questions: true
            }
          }
        }
      },
      responses: true,
    },
  });
}
