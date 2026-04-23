import { withAuth } from "@/lib/api/withAuth";
import { getAuditTemplatesStats } from "@/lib/services/audit-template.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audit/templates/stats ─────────────────────────────────
export const GET = withAuth(async () => {
  try {
    const stats = await getAuditTemplatesStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/protected/audit/templates/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
