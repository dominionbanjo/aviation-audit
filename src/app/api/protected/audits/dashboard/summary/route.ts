import { withAuth } from "@/lib/api/withAuth";
import { getDashboardSummary } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const summary = await getDashboardSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[GET /api/protected/audits/dashboard/summary]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
