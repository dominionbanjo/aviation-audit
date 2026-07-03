import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { getDashboardCharts } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async (_req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const charts = await getDashboardCharts();
    return NextResponse.json(charts);
  } catch (err) {
    console.error("[GET /api/protected/audits/dashboard/charts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
