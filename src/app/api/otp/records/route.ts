import { withAuth } from "@/lib/api/withAuth";
import { getOtpRecordsList, getOtpRecordsListPaginated } from "@/lib/services/otp.service";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api/pagination";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getOtpRecordsListPaginated({ limit, offset, search });
    return NextResponse.json(getPaginatedResponse(rows, total, page, limit));
  } catch (err) {
    console.error("[GET /api/otp/records]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
