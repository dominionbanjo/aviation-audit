import { NextResponse } from "next/server";
import { AuthContext } from "./withAuth";

/**
 * Validates if the authenticated user has one of the allowed roles.
 * Returns a 403 NextResponse if denied, or null if allowed.
 */
export function requireRoles(ctx: AuthContext, allowedRoles: string[]) {
  if (!allowedRoles.includes(ctx.role)) {
    return NextResponse.json(
      { error: "Access denied. Insufficient permissions." },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Ensures the user has auditor privileges or higher (Admin, Manager, Lead Auditor, Auditor).
 */
export function requireAuditor(ctx: AuthContext) {
  return requireRoles(ctx, ["ADMIN", "AUDITOR"]);
}

/**
 * Ensures the user has administrator privileges.
 */
export function requireAdmin(ctx: AuthContext) {
  return requireRoles(ctx, ["ADMIN"]);
}

/**
 * Ensures the user has OTP or Admin privileges.
 * Used for read-only access to entities needed by OTP responders.
 */
export function requireOtpOrAdmin(ctx: AuthContext) {
  return requireRoles(ctx, ["ADMIN", "OTP"]);
}

