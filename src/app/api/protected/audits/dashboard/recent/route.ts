import { withAuth } from "@/lib/api/withAuth";
import { getDashboardRecent } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const recent = await getDashboardRecent();
    return NextResponse.json(recent);
  } catch (err) {
    console.error("[GET /api/protected/audits/dashboard/recent]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
