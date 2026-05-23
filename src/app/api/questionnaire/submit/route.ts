import { withAuth } from "@/lib/api/withAuth";
import { submitOtpRecord } from "@/lib/services/otp.service";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req, { userId }) => {
  try {
    const payload = await req.json();

    // Basic validation
    if (
      !payload.flightNumber ||
      !payload.aircraftRegistration ||
      !payload.aircraftType ||
      !payload.airline ||
      !payload.route ||
      !payload.date ||
      !payload.scheduledDeparture ||
      !payload.actualDeparture ||
      !payload.scheduledArrival ||
      !payload.actualArrival
    ) {
      return NextResponse.json(
        { error: "Missing required flight information fields" },
        { status: 400 }
      );
    }

    const id = await submitOtpRecord({
      ...payload,
      auditorId: userId,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/questionnaire/submit]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
