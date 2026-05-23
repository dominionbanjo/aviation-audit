import { withAuth } from "@/lib/api/withAuth";
import { getOtpAirlines } from "@/lib/services/otp.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const airlines = await getOtpAirlines();
    return NextResponse.json(airlines);
  } catch (err) {
    console.error("[GET /api/otp/airlines]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
