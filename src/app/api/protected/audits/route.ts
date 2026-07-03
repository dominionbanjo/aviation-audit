import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { startAudit, getAuditsPaginated } from "@/lib/services/audit.service";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api/pagination";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audits ────────────────────────────────────────────────
export const GET = withAuth(async (req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getAuditsPaginated({ limit, offset, search });
    return NextResponse.json(getPaginatedResponse(rows, total, page, limit));
  } catch (err) {
    console.error("[GET /api/protected/audits]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── POST /api/protected/audits ───────────────────────────────────────────────
export const POST = withAuth(async (req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  const { userId } = ctx;
  try {
    const { templateId, location } = await req.json();

    if (!templateId || !location) {
      return NextResponse.json(
        { error: "templateId and location are required" },
        { status: 400 }
      );
    }

    const auditId = await startAudit({ templateId, location, auditorId: userId });
    return NextResponse.json({ auditId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/protected/audits]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
