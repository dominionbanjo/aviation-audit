import { withAuth } from "@/lib/api/withAuth";
import { getDashboardCharts } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const charts = await getDashboardCharts();
    return NextResponse.json(charts);
  } catch (err) {
    console.error("[GET /api/protected/audits/dashboard/charts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
