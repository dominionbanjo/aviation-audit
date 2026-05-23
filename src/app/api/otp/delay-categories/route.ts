import { withAuth } from "@/lib/api/withAuth";
import { getOtpDelayCategories } from "@/lib/services/otp.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const categories = await getOtpDelayCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("[GET /api/otp/delay-categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
