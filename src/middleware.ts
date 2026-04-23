import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

// ─── Auth Middleware ──────────────────────────────────────────────────────────
// Runs BEFORE any route handler. There are two layers of auth in this app:
//
//   1. This middleware:  early gate — blocks unauthenticated requests fast
//   2. withAuth HOF:     injects typed user context into each handler
//
// The middleware handles the "logged in at all?" check globally.
// withAuth provides the typed { userId, userEmail, userName } context.
// ─────────────────────────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { data } = await auth.getSession();

  if (!data?.user?.id) {
    // API routes → 401 JSON (consumed by RTK Query → triggers clearAuth → redirect)
    if (req.nextUrl.pathname.startsWith("/api/protected")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Any protected dashboard page → redirect to sign-in with return URL
    const loginUrl = new URL("/auth/sign-in", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all protected API routes and dashboard pages
  // Exclude: /api/auth/* (Neon Auth handles these), static files, _next
  matcher: [
    "/api/protected/:path*",
    "/dashboard/:path*",
  ],
};
