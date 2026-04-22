import { auth } from "@/lib/auth/server";
import { updateTemplate, deleteTemplate, getTemplateById } from "@/lib/services/audit-template.service";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/audit/templates/[id] ───────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (err) {
    console.error("[GET /api/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/audit/templates/[id] ──────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const template = await updateTemplate(id, body);

    return NextResponse.json({ template });
  } catch (err) {
    console.error("[PATCH /api/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/audit/templates/[id] ─────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteTemplate(id);

    return NextResponse.json({ message: "Template deleted" });
  } catch (err) {
    console.error("[DELETE /api/audit/templates/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
