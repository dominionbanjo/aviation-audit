import { withAuth } from "@/lib/api/withAuth";
import { getOtpSummary } from "@/lib/services/otp.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const summary = await getOtpSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[GET /api/otp/summary]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
