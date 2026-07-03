import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { findUserById, upsertUser } from "@/lib/services/user.service";

// ─── Authenticated Session Context ───────────────────────────────────────────
// Passed to every wrapped handler so handlers can access the user without
// calling auth.getSession() themselves.
export interface AuthContext {
  userId: string;
  userEmail: string;
  userName: string | null;
  role: string;
}

type AuthedHandler<TParams = Record<string, string>> = (
  req: NextRequest,
  ctx: AuthContext,
  context?: { params: Promise<TParams> }
) => Promise<NextResponse>;

// ─── withAuth ─────────────────────────────────────────────────────────────────
// Higher-order function that wraps a route handler with session validation.
// If the request has no valid session, it returns 401 immediately.
// If authenticated, it passes the resolved user context to the handler.
//
// Usage:
//   export const GET = withAuth(async (req, { userId, userEmail }) => {
//     return NextResponse.json({ userId });
//   });
//
export function withAuth<TParams = Record<string, string>>(
  handler: AuthedHandler<TParams>
) {
  return async (req: NextRequest, context?: { params: Promise<TParams> }) => {
    try {
      const { data } = await auth.getSession();

      if (!data?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Fetch user role from database
      let dbUser = await findUserById(data.user.id);
      if (!dbUser) {
        // If authenticated but not in database yet, upsert them with default USER role
        dbUser = await upsertUser({
          id: data.user.id,
          email: data.user.email ?? `user-${data.user.id}@aqsams.local`,
          name: data.user.name ?? "",
        });
      }

      if (dbUser.banned) {
        return NextResponse.json({ error: "Your account has been deactivated." }, { status: 403 });
      }

      const ctx: AuthContext = {
        userId: data.user.id,
        userEmail: data.user.email ?? `user-${data.user.id}@aqsams.local`,
        userName: data.user.name ?? null,
        role: dbUser.role ?? "OTP",
      };

      return handler(req, ctx, context);
    } catch (err) {
      console.error("[withAuth] Session check failed:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
