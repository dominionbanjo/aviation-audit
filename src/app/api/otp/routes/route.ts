import { withAuth } from "@/lib/api/withAuth";
import { getOtpRoutes } from "@/lib/services/otp.service";
import { NextResponse } from "next/server";

export const GET = withAuth(async () => {
  try {
    const routes = await getOtpRoutes();
    return NextResponse.json(routes);
  } catch (err) {
    console.error("[GET /api/otp/routes]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
