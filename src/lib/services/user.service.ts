import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or, ilike, sql } from "drizzle-orm";
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

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateUser(id: string, payload: Partial<Omit<User, "id" | "email" | "createdAt">>): Promise<User> {
  const result = await db
    .update(users)
    .set({
      ...payload,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return result[0];
}

// ─── List All Users ──────────────────────────────────────────────────────────
export async function getAllUsers(options?: { limit?: number; offset?: number; search?: string }): Promise<{ rows: User[]; total: number }> {
  let query = db.select().from(users).$dynamic();
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(users).$dynamic();

  if (options?.search) {
    const searchPattern = `%${options.search}%`;
    console.log("[user.service.ts] getAllUsers - searchPattern:", searchPattern);
    query = query.where(
      or(
        ilike(users.name, searchPattern),
        ilike(users.email, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(users.name, searchPattern),
        ilike(users.email, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  if (options?.limit !== undefined && options?.offset !== undefined) {
    query = query.limit(options.limit).offset(options.offset);
  }

  const rows = await query.orderBy(users.createdAt);
  return { rows, total: Number(count || 0) };
}

// ─── Delete User ──────────────────────────────────────────────────────────────
export async function deleteUser(id: string): Promise<void> {
  await db
    .delete(users)
    .where(eq(users.id, id));
}
