import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { completeAudit } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

// ─── PATCH /api/protected/audits/[id]/complete ────────────────────────────────
export const PATCH = withAuth(async (_req, ctx, routeParams) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const { id } = await routeParams!.params;
    await completeAudit(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/protected/audits/[id]/complete]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
