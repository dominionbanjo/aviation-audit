import { withAuth } from "@/lib/api/withAuth";
import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    // Call the Neon Auth server client
    const { error } = await auth.changePassword({
      currentPassword,
      newPassword,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to change password." },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[POST /api/protected/user/change-password]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
