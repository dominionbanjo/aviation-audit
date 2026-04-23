import { withAuth } from "@/lib/api/withAuth";
import { upsertUser, updateUser } from "@/lib/services/user.service";
import { NextResponse } from "next/server";

// ─── GET /api/protected/user/profile ──────────────────────────────────────────
export const GET = withAuth(async (_req, { userId, userEmail, userName }) => {
  try {
    const user = await upsertUser({ id: userId, email: userEmail, name: userName ?? "" });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[GET /api/protected/user/profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── PATCH /api/protected/user/profile ────────────────────────────────────────
export const PATCH = withAuth(async (req, { userId }) => {
  try {
    const body = await req.json();
    const { name, role } = body;
    const user = await updateUser(userId, { name, role });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PATCH /api/protected/user/profile]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
