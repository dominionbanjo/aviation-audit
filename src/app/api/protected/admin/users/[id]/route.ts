import { withAuth } from "@/lib/api/withAuth";
import { requireRoles } from "@/lib/api/rbac";
import { updateUser, deleteUser } from "@/lib/services/user.service";
import { NextResponse } from "next/server";

// ─── PATCH /api/protected/admin/users/[id] ───────────────────────────────────
// Update a user's role or profile details (Admins only)
export const PATCH = withAuth(async (req, ctx, routeParams) => {
  const isDenied = requireRoles(ctx, ["ADMIN"]);
  if (isDenied) return isDenied;

  try {
    const { id } = await routeParams!.params;
    const { name, role } = await req.json();

    if (role) {
      const validRoles = ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR", "USER"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
      }
    }

    const user = await updateUser(id, { name, role });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PATCH /api/protected/admin/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── DELETE /api/protected/admin/users/[id] ───────────────────────────────────
// Delete a user (Admins only)
export const DELETE = withAuth(async (_req, ctx, routeParams) => {
  const isDenied = requireRoles(ctx, ["ADMIN"]);
  if (isDenied) return isDenied;

  try {
    const { id } = await routeParams!.params;
    
    // Prevent self-deletion
    if (ctx.userId === id) {
      return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("[DELETE /api/protected/admin/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
