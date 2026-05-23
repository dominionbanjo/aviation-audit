import { withAuth } from "@/lib/api/withAuth";
import { getRoutesList, createRouteEntity } from "@/lib/services/entity.service";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api/pagination";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getRoutesList({ limit, offset, search });
    return NextResponse.json(getPaginatedResponse(rows, total, page, limit));
  } catch (err) {
    console.error("[GET /api/protected/routes]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

export const POST = withAuth(async (req) => {
  try {
    const { origin, destination, code } = await req.json();
    if (!origin || !destination || !code) {
      return NextResponse.json({ error: "Origin, Destination and Code are required" }, { status: 400 });
    }
    const route = await createRouteEntity({ origin, destination, code });
    return NextResponse.json({ route }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/protected/routes]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
