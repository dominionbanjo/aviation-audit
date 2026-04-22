import { auth } from "@/lib/auth/server";
import { getTemplates, createTemplate } from "@/lib/services/audit-template.service";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/audit/templates ─────────────────────────────────────────────────
export async function GET() {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await getTemplates();
    return NextResponse.json({ templates });
  } catch (err) {
    console.error("[GET /api/audit/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ─── POST /api/audit/templates ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { data } = await auth.getSession();
    if (!data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      createdBy: data.user.id,
      categories: categories ?? [],
    });

    return NextResponse.json({ templateId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/audit/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
