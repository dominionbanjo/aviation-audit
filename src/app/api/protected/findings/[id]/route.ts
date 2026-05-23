import { withAuth } from "@/lib/api/withAuth";
import { updateFinding } from "@/lib/services/findings.service";
import { NextResponse } from "next/server";

export const PATCH = withAuth<{ id: string }>(async (req, _ctx, routeParams) => {
  try {
    const { id } = await routeParams!.params;

    if (!id) {
      return NextResponse.json({ error: "Missing finding ID" }, { status: 400 });
    }

    const payload = await req.json();
    await updateFinding(id, payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/protected/findings/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
