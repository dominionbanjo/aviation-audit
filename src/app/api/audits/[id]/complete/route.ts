import { auth } from "@/lib/auth/server";
import { completeAudit } from "@/lib/services/audit.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await completeAudit(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/audits/[id]/complete]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
