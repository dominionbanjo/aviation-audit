import { db } from "@/lib/db";
import { otpRecords } from "@/lib/db/schema";
import { eq, sql, and, desc, asc, or, ilike } from "drizzle-orm";
import type { InsertOtpRecord, OtpRecord } from "@/lib/db/schema";

export async function getOtpRecordsListPaginated(options: { limit: number; offset: number; search?: string }): Promise<{ rows: OtpRecord[]; total: number }> {
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(otpRecords).$dynamic();
  let query = db.select().from(otpRecords).$dynamic();

  if (options.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(
      or(
        ilike(otpRecords.flightNumber, searchPattern),
        ilike(otpRecords.airline, searchPattern),
        ilike(otpRecords.route, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(otpRecords.flightNumber, searchPattern),
        ilike(otpRecords.airline, searchPattern),
        ilike(otpRecords.route, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  const rows = await query
    .orderBy(desc(otpRecords.date))
    .limit(options.limit)
    .offset(options.offset);

  return { rows, total: Number(count || 0) };
}

// ─── Map Delay Codes to IATA Meanings ──────────────────────────────────────────
export const DELAY_CODE_MAP: Record<string, string> = {
  "11": "Passenger Handling",
  "31": "Aircraft Handling",
  "41": "Maintenance",
  "61": "Crew",
  "71": "Weather",
  "81": "ATC / Airport Restrictions",
  "91": "Reactionary Delay",
};

// ─── Submit OTP Questionnaire Record ──────────────────────────────────────────
export async function submitOtpRecord(payload: InsertOtpRecord): Promise<string> {
  const schedDep = new Date(payload.scheduledDeparture);
  const actDep = new Date(payload.actualDeparture);
  
  // Calculate delay in minutes
  const diffMs = actDep.getTime() - schedDep.getTime();
  const calculatedDelayMinutes = Math.max(0, Math.floor(diffMs / 60000));
  
  // OTP standard: Flight is on-time if departure delay <= 15 minutes
  const wasDelayed = calculatedDelayMinutes > 15;

  const [newRecord] = await db
    .insert(otpRecords)
    .values({
      ...payload,
      delayMinutes: calculatedDelayMinutes,
      wasDelayed,
    })
    .returning({ id: otpRecords.id });

  return newRecord.id;
}

// ─── Get OTP Summary Metrics & Trend ──────────────────────────────────────────
export async function getOtpSummary() {
  const [counts] = await db
    .select({
      total: sql<number>`count(*)`,
      delayed: sql<number>`count(*) filter (where ${otpRecords.delayMinutes} > 15)`,
      avgDelay: sql<number>`coalesce(avg(${otpRecords.delayMinutes}), 0)`,
    })
    .from(otpRecords);

  const total = Number(counts?.total || 0);
  const delayed = Number(counts?.delayed || 0);
  const onTime = total - delayed;
  const otp = total > 0 ? Math.round((onTime / total) * 100) : 100;
  const avgDelay = Math.round(Number(counts?.avgDelay || 0));

  // Fetch trend data (grouped by date) for the last 15 entries/dates
  const trendRows = await db
    .select({
      dateStr: sql<string>`to_char(${otpRecords.date}, 'YYYY-MM-DD')`,
      total: sql<number>`count(*)`,
      delayed: sql<number>`count(*) filter (where ${otpRecords.delayMinutes} > 15)`,
    })
    .from(otpRecords)
    .groupBy(sql`to_char(${otpRecords.date}, 'YYYY-MM-DD')`)
    .orderBy(asc(sql`to_char(${otpRecords.date}, 'YYYY-MM-DD')`))
    .limit(30);

  const trend = trendRows.map(row => {
    const t = Number(row.total || 0);
    const d = Number(row.delayed || 0);
    const ot = t - d;
    return {
      date: row.dateStr,
      otp: t > 0 ? Math.round((ot / t) * 100) : 100,
      flights: t,
    };
  });

  return {
    totalFlights: total,
    otpPercentage: otp,
    averageDelay: avgDelay,
    delayedFlights: delayed,
    trend,
  };
}

// ─── Get Airline OTP Rankings ───────────────────────────────────────────────
export async function getOtpAirlines() {
  const rows = await db
    .select({
      airline: otpRecords.airline,
      total: sql<number>`count(*)`,
      delayed: sql<number>`count(*) filter (where ${otpRecords.delayMinutes} > 15)`,
    })
    .from(otpRecords)
    .groupBy(otpRecords.airline)
    .orderBy(desc(sql`count(*)`));

  return rows.map(r => {
    const total = Number(r.total || 0);
    const delayed = Number(r.delayed || 0);
    const onTime = total - delayed;
    return {
      airline: r.airline,
      totalFlights: total,
      otp: total > 0 ? Math.round((onTime / total) * 100) : 100,
    };
  }).sort((a, b) => b.otp - a.otp); // Rank by OTP descending
}

// ─── Get Delay Categories Breakdown ──────────────────────────────────────────
export async function getOtpDelayCategories() {
  const rows = await db
    .select({
      delayCode: otpRecords.delayCode,
      count: sql<number>`count(*)`,
    })
    .from(otpRecords)
    .where(eq(otpRecords.wasDelayed, true))
    .groupBy(otpRecords.delayCode)
    .orderBy(desc(sql`count(*)`));

  return rows.map(r => {
    const code = r.delayCode || "Other";
    return {
      code,
      name: DELAY_CODE_MAP[code] || "Other / Operational Issues",
      value: Number(r.count || 0),
    };
  });
}

// ─── Get Route Performance Metrics ──────────────────────────────────────────
export async function getOtpRoutes() {
  const rows = await db
    .select({
      route: otpRecords.route,
      total: sql<number>`count(*)`,
      delayed: sql<number>`count(*) filter (where ${otpRecords.delayMinutes} > 15)`,
      avgDelay: sql<number>`coalesce(avg(${otpRecords.delayMinutes}), 0)`,
    })
    .from(otpRecords)
    .groupBy(otpRecords.route)
    .orderBy(desc(sql`count(*)`));

  return rows.map(r => {
    const total = Number(r.total || 0);
    const delayed = Number(r.delayed || 0);
    const onTime = total - delayed;
    return {
      route: r.route,
      totalFlights: total,
      otp: total > 0 ? Math.round((onTime / total) * 100) : 100,
      avgDelay: Math.round(Number(r.avgDelay || 0)),
    };
  });
}

// ─── Get All Audited OTP Flight Records ──────────────────────────────────────
export async function getOtpRecordsList(): Promise<OtpRecord[]> {
  return await db
    .select()
    .from(otpRecords)
    .orderBy(desc(otpRecords.date));
}
