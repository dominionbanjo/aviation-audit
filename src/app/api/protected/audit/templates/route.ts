import { withAuth } from "@/lib/api/withAuth";
import { getTemplates, createTemplate } from "@/lib/services/audit-template.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/audit/templates ───────────────────────────────────────
export const GET = withAuth(async () => {
  try {
    const templates = await getTemplates();
    return NextResponse.json({ templates });
  } catch (err) {
    console.error("[GET /api/protected/audit/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── POST /api/protected/audit/templates ──────────────────────────────────────
export const POST = withAuth(async (req, { userId }) => {
  try {
    const body = await req.json();
    const { name, locationType, regulatoryBase, categories } = body as {
      name: string;
      locationType: string;
      regulatoryBase: string;
      categories: {
        name: string;
        orderIndex: number;
        questions: { query: string; manualRef?: string; orderIndex: number }[];
      }[];
    };

    if (!name || !locationType || !regulatoryBase) {
      return NextResponse.json(
        { error: "name, locationType and regulatoryBase are required" },
        { status: 400 }
      );
    }

    const templateId = await createTemplate({
      name,
      locationType,
      regulatoryBase,
      createdBy: userId,
      categories: categories ?? [],
    });

    return NextResponse.json({ templateId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/protected/audit/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
