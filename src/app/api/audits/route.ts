import { auth } from "@/lib/auth/server";
import { getAudits, startAudit } from "@/lib/services/audit.service";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/audits ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const audits = await getAudits();
    return NextResponse.json({ audits });
  } catch (err) {
    console.error("[GET /api/audits]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/audits ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId, location } = await req.json();

    if (!templateId || !location) {
      return NextResponse.json({ error: "templateId and location are required" }, { status: 400 });
    }

    const auditId = await startAudit({
      templateId,
      location,
      auditorId: data.user.id,
    });

    return NextResponse.json({ auditId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/audits]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
