import { auth } from "@/lib/auth/server";
import { getAuditTemplatesStats } from "@/lib/services/audit-template.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAuditTemplatesStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/audit/templates/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
