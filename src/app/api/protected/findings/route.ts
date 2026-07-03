import { withAuth } from "@/lib/api/withAuth";
import { requireAuditor } from "@/lib/api/rbac";
import {  getFindingsPaginated } from "@/lib/services/findings.service";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api/pagination";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, ctx) => {
  const isDenied = requireAuditor(ctx);
  if (isDenied) return isDenied;
  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getFindingsPaginated({ limit, offset, search });
    return NextResponse.json(getPaginatedResponse(rows, total, page, limit));
  } catch (err) {
    console.error("[GET /api/protected/findings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
