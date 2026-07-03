import { withAuth } from "@/lib/api/withAuth";
import { requireRoles } from "@/lib/api/rbac";
import { updateUser } from "@/lib/services/user.service";
import { NextResponse } from "next/server";

// ─── POST /api/protected/admin/users/[id]/restore ────────────────────────────
// Restore / un-revoke a user's access (Admins only)
export const POST = withAuth(async (_req, ctx, routeParams) => {
  const isDenied = requireRoles(ctx, ["ADMIN"]);
  if (isDenied) return isDenied;

  try {
    const { id } = await routeParams!.params;
    await updateUser(id, { banned: false });
    return NextResponse.json({ message: "User access restored successfully." });
  } catch (err) {
    console.error("[POST /api/protected/admin/users/[id]/restore]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
