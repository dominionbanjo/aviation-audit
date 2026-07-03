import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { getAuditForExecution } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audits/[id] ──────────────────────────────────────────
export const GET = withAuth(async (_req, ctx, routeParams) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const { id } = await routeParams!.params;
    const audit = await getAuditForExecution(id);

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({ audit });
  } catch (err) {
    console.error("[GET /api/protected/audits/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
