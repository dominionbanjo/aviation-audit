import { auth } from "@/lib/auth/server";
import { getAuditForExecution } from "@/lib/services/audit.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const audit = await getAuditForExecution(id);

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({ audit });
  } catch (err) {
    console.error("[GET /api/audits/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
