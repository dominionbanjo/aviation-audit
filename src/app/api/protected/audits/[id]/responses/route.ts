import { withAuth } from "@/lib/api/withAuth";
import { saveAuditResponse } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

// ─── POST /api/protected/audits/[id]/responses ────────────────────────────────
export const POST = withAuth(async (req, _ctx, routeParams) => {
  try {
    const { id } = await routeParams!.params;
    const { questionId, responseValue, comment } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    await saveAuditResponse({ auditId: id, questionId, responseValue, comment });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/protected/audits/[id]/responses]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
