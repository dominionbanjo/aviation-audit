import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";

// ─── Edge-Level Auth & RBAC Middleware ───────────────────────────────────────
export async function proxy(req: NextRequest) {
  const { data } = await auth.getSession();
  const { pathname } = req.nextUrl;

  // 1. Unauthenticated Session Guard
  if (!data?.user?.id) {
    if (pathname.startsWith("/api/protected")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/sign-in", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Fetch User Role directly from DB (using Neon edge-compatible client)
  let userRole = "USER";
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const sql = neon(databaseUrl);
      const dbUsers = await sql`SELECT role FROM users WHERE id = ${data.user.id} LIMIT 1`;
      if (dbUsers && dbUsers.length > 0) {
        userRole = (dbUsers[0].role as string) || "USER";
      }
    }
  } catch (err) {
    console.error("[Middleware RBAC] Database check failed:", err);
    // Safe default to USER on DB failure to prevent privilege escalation
    userRole = "USER";
  }

  // 3. Admin-only Access Controls
  const adminRoutes = [
    "/dashboard/staff",
    "/dashboard/airlines",
    "/dashboard/routes",
    "/dashboard/compliance"
  ];
  
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/api/protected/admin");

  if (isAdminRoute && userRole !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }
    const fallbackDashboard = userRole === "USER" ? "/dashboard/otp" : "/dashboard";
    return NextResponse.redirect(new URL(fallbackDashboard, req.url));
  }

  // 4. OTP Responder (USER) Route Constraints
  if (userRole === "USER") {
    // Block OTP users from visiting general auditor dashboards
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/otp") && !pathname.startsWith("/dashboard/settings")) {
      return NextResponse.redirect(new URL("/dashboard/otp", req.url));
    }
    // Block OTP users from templates/audits APIs
    if (pathname.startsWith("/api/protected/audit")) {
      return NextResponse.json(
        { error: "Forbidden: Auditor role required" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Exclude: static files, /_next, and Neon Auth public API endpoints
  matcher: [
    "/api/protected/:path*",
    "/dashboard/:path*",
  ],
};
