import { auth } from "@/lib/auth/server";
import { getAuditStats } from "@/lib/services/audit.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAuditStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/audits/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
