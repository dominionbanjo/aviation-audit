import { auth } from "@/lib/auth/server";
import { saveAuditResponse } from "@/lib/services/audit.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { questionId, responseValue, comment } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    await saveAuditResponse({
      auditId: id,
      questionId,
      responseValue,
      comment,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/audits/[id]/responses]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
