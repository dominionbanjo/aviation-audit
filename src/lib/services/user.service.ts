import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User, InsertUser } from "@/lib/db/schema";

// ─── Upsert ───────────────────────────────────────────────────────────────────
// Creates a user if they don't exist, or updates their name/email if they do.
// Called after every successful auth session (login, signup, profile fetch).
export async function upsertUser(payload: InsertUser): Promise<User> {
  const result = await db
    .insert(users)
    .values(payload)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: payload.email,
        name: payload.name,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result[0];
}

// ─── Find by ID ───────────────────────────────────────────────────────────────
export async function findUserById(id: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0] ?? null;
}

// ─── Find by Email ────────────────────────────────────────────────────────────
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
}
