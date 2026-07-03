import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import { getFindingStats } from "@/lib/services/findings.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async (_req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const stats = await getFindingStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/protected/findings/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
