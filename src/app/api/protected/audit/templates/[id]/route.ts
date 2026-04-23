import { withAuth } from "@/lib/api/withAuth";
import { updateTemplate, deleteTemplate, getTemplateById } from "@/lib/services/audit-template.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audit/templates/[id] ─────────────────────────────────
export const GET = withAuth(async (_req, _ctx, routeParams) => {
  try {
    const { id } = await routeParams!.params;
    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (err) {
    console.error("[GET /api/protected/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── PATCH /api/protected/audit/templates/[id] ────────────────────────────────
export const PATCH = withAuth(async (req, _ctx, routeParams) => {
  try {
    const { id } = await routeParams!.params;
    const body = await req.json();
    const template = await updateTemplate(id, body);
    return NextResponse.json({ template });
  } catch (err) {
    console.error("[PATCH /api/protected/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── DELETE /api/protected/audit/templates/[id] ───────────────────────────────
export const DELETE = withAuth(async (_req, _ctx, routeParams) => {
  try {
    const { id } = await routeParams!.params;
    await deleteTemplate(id);
    return NextResponse.json({ message: "Template deleted" });
  } catch (err) {
    console.error("[DELETE /api/protected/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
