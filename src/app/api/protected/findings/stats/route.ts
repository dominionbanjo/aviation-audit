import { withAuth } from "@/lib/api/withAuth";
import { getFindingStats } from "@/lib/services/findings.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const stats = await getFindingStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[GET /api/protected/findings/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
