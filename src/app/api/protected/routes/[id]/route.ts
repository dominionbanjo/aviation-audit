import { withAuth } from "@/lib/api/withAuth";
import { requireAdmin } from "@/lib/api/rbac";
import { updateRouteEntity, deleteRouteEntity } from "@/lib/services/entity.service";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (req, ctx, routeParams) => {
  const isDenied = requireAdmin(ctx);
  if (isDenied) return isDenied;
  try {
    const { id } = await routeParams!.params;
    const body = await req.json();
    const route = await updateRouteEntity(id, body);
    return NextResponse.json({ route });
  } catch (err) {
    console.error("[PATCH /api/protected/routes/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

export const DELETE = withAuth(async (_req, ctx, routeParams) => {
  const isDenied = requireAdmin(ctx);
  if (isDenied) return isDenied;
  try {
    const { id } = await routeParams!.params;
    await deleteRouteEntity(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/protected/routes/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
