import { withAuth } from "@/lib/api/withAuth";
import { requireRoles } from "@/lib/api/rbac";
import { getAllUsers, upsertUser } from "@/lib/services/user.service";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

import { getPaginationParams } from "@/lib/api/pagination";

// ─── GET /api/protected/admin/users ──────────────────────────────────────────
// List all users in the system (Admins only)
export const GET = withAuth(async (req, ctx) => {
  const isDenied = requireRoles(ctx, ["ADMIN"]);
  if (isDenied) return isDenied;

  try {
    const { page, limit, offset, search } = getPaginationParams(req.url);
    const { rows, total } = await getAllUsers({ limit, offset, search });
    
    // We construct pagination metadata
    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      users: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (err) {
    console.error("[GET /api/protected/admin/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// ─── POST /api/protected/admin/users ─────────────────────────────────────────
// Invite/create a new user (Admins only)
export const POST = withAuth(async (req, ctx) => {
  const isDenied = requireRoles(ctx, ["ADMIN"]);
  if (isDenied) return isDenied;

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR", "USER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: "Authentication system not configured." }, { status: 500 });
    }

    const origin = req.headers.get("origin") || new URL(req.url).origin;

    // Register user via Neon Auth backend
    const authRes = await fetch(`${baseUrl}/sign-up/email`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": origin
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!authRes.ok) {
      const err = await authRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { message?: string }).message || "Failed to register user in Auth Provider." },
        { status: authRes.status }
      );
    }

    const authData = (await authRes.json()) as { user?: { id: string; email: string; name: string } };
    const authUser = authData.user;

    if (!authUser) {
      return NextResponse.json({ error: "Failed to register user in Auth Provider." }, { status: 500 });
    }

    // Insert user with the specified role into our database
    const user = await upsertUser({
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      role: role as any,
    });

    // Send verification / welcome email using the configured Neon SMTP provider
    try {
      await auth.sendVerificationEmail({
        email: authUser.email,
        callbackURL: `${origin}/dashboard`,
      });
    } catch (emailErr) {
      console.error("[POST /api/protected/admin/users] Welcome email sending failed:", emailErr);
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/protected/admin/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
