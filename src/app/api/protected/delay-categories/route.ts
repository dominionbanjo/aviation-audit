import { withAuth } from "@/lib/api/withAuth";
import { getDelayCategoriesList, createDelayCategoryEntity } from "@/lib/services/entity.service";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api/pagination";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getDelayCategoriesList({ limit, offset, search });
    return NextResponse.json(getPaginatedResponse(rows, total, page, limit));
  } catch (err) {
    console.error("[GET /api/protected/delay-categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

export const POST = withAuth(async (req) => {
  try {
    const { code, name, description } = await req.json();
    if (!code || !name) {
      return NextResponse.json({ error: "Code and Name are required" }, { status: 400 });
    }
    const category = await createDelayCategoryEntity({ code, name, description });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/protected/delay-categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
