import { db } from "@/lib/db";
import { audits, auditResponses, auditQuestions } from "@/lib/db/schema";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import { auditTemplates, users } from "@/lib/db/schema";
import type { Audit } from "@/lib/db/schema";

export interface AuditWithMeta extends Audit {
  templateName: string;
  auditorName: string | null;
  responseCount: number;
}

export async function getAuditsPaginated(options: { limit: number; offset: number; search?: string }): Promise<{ rows: AuditWithMeta[]; total: number }> {
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(audits).$dynamic();
  
  let query = db
    .select({
      id: audits.id,
      refNo: audits.refNo,
      templateId: audits.templateId,
      auditorId: audits.auditorId,
      location: audits.location,
      date: audits.date,
      status: audits.status,
      startedAt: audits.startedAt,
      completedAt: audits.completedAt,
      templateName: auditTemplates.name,
      auditorName: users.name,
      responseCount: sql<number>`count(${auditResponses.id})`.mapWith(Number),
    })
    .from(audits)
    .leftJoin(auditTemplates, eq(auditTemplates.id, audits.templateId))
    .leftJoin(users, eq(users.id, audits.auditorId))
    .leftJoin(auditResponses, eq(auditResponses.auditId, audits.id))
    .groupBy(audits.id, auditTemplates.name, users.name)
    .$dynamic();

  if (options.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(
      or(
        ilike(audits.refNo, searchPattern),
        ilike(audits.location, searchPattern),
        ilike(auditTemplates.name, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(audits.refNo, searchPattern),
        ilike(audits.location, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  const rows = await query
    .orderBy(desc(audits.startedAt))
    .limit(options.limit)
    .offset(options.offset);

  const mappedRows = rows.map(r => ({
    ...r,
    templateName: r.templateName ?? "Unknown Template",
    auditorName: r.auditorName ?? "Unknown Auditor",
    responseCount: Number(r.responseCount)
  }));

  return { rows: mappedRows, total: Number(count || 0) };
}

// ─── List Audits ──────────────────────────────────────────────────────────────
export async function getAudits(): Promise<AuditWithMeta[]> {
  const rows = await db
    .select({
      id: audits.id,
      refNo: audits.refNo,
      templateId: audits.templateId,
      auditorId: audits.auditorId,
      location: audits.location,
      date: audits.date,
      status: audits.status,
      startedAt: audits.startedAt,
      completedAt: audits.completedAt,
      templateName: auditTemplates.name,
      auditorName: users.name,
      responseCount: sql<number>`count(${auditResponses.id})`.mapWith(Number),
    })
    .from(audits)
    .leftJoin(auditTemplates, eq(auditTemplates.id, audits.templateId))
    .leftJoin(users, eq(users.id, audits.auditorId))
    .leftJoin(auditResponses, eq(auditResponses.auditId, audits.id))
    .groupBy(audits.id, auditTemplates.name, users.name)
    .orderBy(desc(audits.startedAt));

  return rows.map(r => ({
    ...r,
    templateName: r.templateName ?? "Unknown Template",
    auditorName: r.auditorName ?? "Unknown Auditor",
    responseCount: Number(r.responseCount)
  }));
}

// ─── Start New Audit ──────────────────────────────────────────────────────────
export async function startAudit(payload: {
  templateId: string;
  auditorId: string;
  location: string;
}): Promise<string> {
  const { templateId, auditorId, location } = payload;

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  
  // OPTIMIZATION: Use index-friendly date range instead of date_trunc
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayAudits = await db
    .select({ count: sql<number>`count(*)` })
    .from(audits)
    .where(
      and(
        sql`${audits.startedAt} >= ${startOfDay}`,
        sql`${audits.startedAt} <= ${endOfDay}`
      )
    );
  
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
      target: [auditResponses.auditId, auditResponses.questionId],
      set: {
        responseValue,
        comment: comment ?? null,
      },
    });
}

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
  const [{ count: totalCompleted }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(audits)
    .where(eq(audits.status, "completed"));

  const [{ count: totalInProgress }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(audits)
    .where(eq(audits.status, "in-progress"));

  const [{ count: uniqueLocations }] = await db
    .select({ count: sql<number>`count(distinct lower(${audits.location}))` })
    .from(audits);

  return {
    totalAuditsDone: Number(totalCompleted),
    activeAudits: Number(totalInProgress),
    uniqueLocations: Number(uniqueLocations),
  };
}

// ─── Dashboard Services ──────────────────────────────────────────────────────

/**
 * 1. Dashboard Summary: The 4 high-level stat cards
 */
export async function getDashboardSummary() {
  try {
    const [{ count: totalAudits }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(audits);

    const [{ count: openFindings }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditResponses)
      .where(eq(auditResponses.responseValue, "UNSAT"));
    
    // For critical findings, we need to join with questions to see the severity
    let criticalFindingsCount = 0;
    try {
      const criticalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(auditResponses)
        .innerJoin(auditQuestions, eq(auditResponses.questionId, auditQuestions.id))
        .where(and(
          eq(auditResponses.responseValue, "UNSAT"),
          eq(auditQuestions.severity, "Critical")
        ));
      criticalFindingsCount = Number(criticalResult[0]?.count || 0);
    } catch {
      console.warn("Severity columns missing or error, using fallback for critical findings");
      criticalFindingsCount = Number(openFindings); // Fallback
    }

    // Compliance Score: SAT / (SAT + UNSAT)
    const [{ count: satCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditResponses)
      .where(eq(auditResponses.responseValue, "SAT"));

    const complianceScore = (Number(satCount) + Number(openFindings)) > 0 
      ? Math.round((Number(satCount) / (Number(satCount) + Number(openFindings))) * 100) 
      : 100;

    return {
      totalAudits: Number(totalAudits),
      openFindings: Number(openFindings),
      criticalFindings: criticalFindingsCount,
      complianceScore: `${complianceScore}%`,
    };
  } catch (err) {
    console.error("Dashboard Summary Error:", err);
    return { totalAudits: 0, openFindings: 0, criticalFindings: 0, complianceScore: "0%" };
  }
}

export interface FindingItem {
  desc: string;
  audit: string;
  sev: string;
  color: string;
}

/**
 * 2. Dashboard Recent: Tables for recent audits and findings
 */
export async function getDashboardRecent() {
  try {
    const recentAuditsRaw = await db.query.audits.findMany({
      limit: 5,
      orderBy: [desc(audits.startedAt)],
      with: {
        template: { columns: { name: true } }
      }
    });

    let recentFindings: FindingItem[] = [];
    try {
      const recentFindingsRaw = await db.query.auditResponses.findMany({
        limit: 5,
        where: eq(auditResponses.responseValue, "UNSAT"),
        orderBy: [desc(auditResponses.createdAt)], 
        with: {
          question: true,
          audit: { columns: { refNo: true } }
        }
      });
      recentFindings = recentFindingsRaw.map(f => ({
        desc: f.question?.query || "Unknown Question",
        audit: f.audit?.refNo || "Unknown",
        sev: f.question?.severity || "Minor",
        color: f.question?.severity === "Critical" ? "text-red-500 bg-red-500/10 border-red-500/20" : 
               f.question?.severity === "Major" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : 
               "text-blue-500 bg-blue-500/10 border-blue-500/20"
      }));
    } catch {
      console.warn("Recent findings query failed (missing columns?), using basic fallback");
      const baseFindings = await db.query.auditResponses.findMany({ 
        limit: 5, 
        where: eq(auditResponses.responseValue, "UNSAT"),
        with: { audit: true }
      });
      recentFindings = baseFindings.map(f => ({
        desc: "Requires Audit Review",
        audit: (f.audit as { refNo?: string })?.refNo || "Unknown",
        sev: "Minor",
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
      }));
    }

    return {
      recentAudits: recentAuditsRaw.map(a => ({
        id: a.id,
        ref: a.refNo,
        loc: a.location,
        date: a.startedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: a.status.charAt(0).toUpperCase() + a.status.slice(1).replace('-', ' '),
        color: a.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
      })),
      recentFindings
    };
  } catch (err) {
    console.error("Dashboard Recent Error:", err);
    return { recentAudits: [], recentFindings: [] };
  }
}

/**
 * 3. Dashboard Charts: Data for Recharts visualizations
 */
export async function getDashboardCharts() {
  try {
    const last6MonthsDates = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      d.setDate(1); // Start of month
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    // PERFORMANCE DATA: Real Sat vs Unsat counts per month
    const performanceData = await Promise.all(last6MonthsDates.map(async (monthStart) => {
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const [{ count: sat }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(auditResponses)
        .where(and(
          eq(auditResponses.responseValue, "SAT"),
          sql`${auditResponses.createdAt} >= ${monthStart}`,
          sql`${auditResponses.createdAt} < ${monthEnd}`
        ));

      const [{ count: unsat }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(auditResponses)
        .where(and(
          eq(auditResponses.responseValue, "UNSAT"),
          sql`${auditResponses.createdAt} >= ${monthStart}`,
          sql`${auditResponses.createdAt} < ${monthEnd}`
        ));

      return {
        month: monthStart.toLocaleString('default', { month: 'short' }),
        sat: Number(sat),
        unsat: Number(unsat),
      };
    }));

    // SEVERITY BREAKDOWN: Real distribution
    const severityData = [
      { name: "Critical", value: 0, color: "#ef4444" },
      { name: "Major", value: 0, color: "#f59e0b" },
      { name: "Minor", value: 0, color: "#3b82f6" },
    ];

    try {
      const severityBreakdown = await db
        .select({ 
          severity: auditQuestions.severity,
          count: sql<number>`count(*)` 
        })
        .from(auditResponses)
        .innerJoin(auditQuestions, eq(auditResponses.questionId, auditQuestions.id))
        .where(eq(auditResponses.responseValue, "UNSAT"))
        .groupBy(auditQuestions.severity);

      severityBreakdown.forEach(s => {
        const item = severityData.find(d => d.name === s.severity);
        if (item) item.value = Number(s.count);
      });
    } catch {
      console.warn("Severity pie chart data failed (missing columns/data), showing zeros");
    }

    return {
      performanceData,
      severityData,
      totalFindings: severityData.reduce((acc, curr) => acc + curr.value, 0)
    };
  } catch (err) {
    console.error("Dashboard Charts Error:", err);
    return { performanceData: [], severityData: [], totalFindings: 0 };
  }
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
      responses: {
        with: {
          question: true
        }
      },
    },
  });
}
