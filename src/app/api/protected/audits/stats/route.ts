import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { getAuditStats } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audits/stats ──────────────────────────────────────────
export const GET = withAuth(async (_req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const stats = await getAuditStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/protected/audits/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
