import { db } from "@/lib/db";
import { airlines, routes, delayCategories } from "@/lib/db/schema";
import { eq, desc, or, ilike, sql } from "drizzle-orm";
import type { Airline, InsertAirline, Route, InsertRoute, DelayCategory, InsertDelayCategory } from "@/lib/db/schema";

// ─── Airlines Service ────────────────────────────────────────────────────────
export async function getAirlinesList(options?: { limit?: number; offset?: number; search?: string }): Promise<{ rows: Airline[]; total: number }> {
  let query = db.select().from(airlines).$dynamic();
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(airlines).$dynamic();

  if (options?.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(
      or(
        ilike(airlines.name, searchPattern),
        ilike(airlines.code, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(airlines.name, searchPattern),
        ilike(airlines.code, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  if (options?.limit !== undefined && options?.offset !== undefined) {
    query = query.limit(options.limit).offset(options.offset);
  }

  const rows = await query.orderBy(desc(airlines.createdAt));
  return { rows, total: Number(count || 0) };
}

export async function createAirlineEntity(payload: InsertAirline): Promise<Airline> {
  const [row] = await db.insert(airlines).values(payload).returning();
  return row;
}

export async function updateAirlineEntity(id: string, payload: Partial<InsertAirline>): Promise<Airline> {
  const [row] = await db.update(airlines).set(payload).where(eq(airlines.id, id)).returning();
  return row;
}

export async function deleteAirlineEntity(id: string): Promise<void> {
  await db.delete(airlines).where(eq(airlines.id, id));
}

// ─── Routes Service ──────────────────────────────────────────────────────────
export async function getRoutesList(options?: { limit?: number; offset?: number; search?: string }): Promise<{ rows: Route[]; total: number }> {
  let query = db.select().from(routes).$dynamic();
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(routes).$dynamic();

  if (options?.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(
      or(
        ilike(routes.origin, searchPattern),
        ilike(routes.destination, searchPattern),
        ilike(routes.code, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(routes.origin, searchPattern),
        ilike(routes.destination, searchPattern),
        ilike(routes.code, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  if (options?.limit !== undefined && options?.offset !== undefined) {
    query = query.limit(options.limit).offset(options.offset);
  }

  const rows = await query.orderBy(desc(routes.createdAt));
  return { rows, total: Number(count || 0) };
}

export async function createRouteEntity(payload: InsertRoute): Promise<Route> {
  const [row] = await db.insert(routes).values(payload).returning();
  return row;
}

export async function updateRouteEntity(id: string, payload: Partial<InsertRoute>): Promise<Route> {
  const [row] = await db.update(routes).set(payload).where(eq(routes.id, id)).returning();
  return row;
}

export async function deleteRouteEntity(id: string): Promise<void> {
  await db.delete(routes).where(eq(routes.id, id));
}

// ─── Delay Categories Service ────────────────────────────────────────────────
export async function getDelayCategoriesList(options?: { limit?: number; offset?: number; search?: string }): Promise<{ rows: DelayCategory[]; total: number }> {
  let query = db.select().from(delayCategories).$dynamic();
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(delayCategories).$dynamic();

  if (options?.search) {
    const searchPattern = `%${options.search}%`;
    query = query.where(
      or(
        ilike(delayCategories.name, searchPattern),
        ilike(delayCategories.code, searchPattern)
      )
    );
    countQuery = countQuery.where(
      or(
        ilike(delayCategories.name, searchPattern),
        ilike(delayCategories.code, searchPattern)
      )
    );
  }

  const [{ count }] = await countQuery;

  if (options?.limit !== undefined && options?.offset !== undefined) {
    query = query.limit(options.limit).offset(options.offset);
  }

  const rows = await query.orderBy(desc(delayCategories.createdAt));
  return { rows, total: Number(count || 0) };
}

export async function createDelayCategoryEntity(payload: InsertDelayCategory): Promise<DelayCategory> {
  const [row] = await db.insert(delayCategories).values(payload).returning();
  return row;
}

export async function updateDelayCategoryEntity(id: string, payload: Partial<InsertDelayCategory>): Promise<DelayCategory> {
  const [row] = await db.update(delayCategories).set(payload).where(eq(delayCategories.id, id)).returning();
  return row;
}

export async function deleteDelayCategoryEntity(id: string): Promise<void> {
  await db.delete(delayCategories).where(eq(delayCategories.id, id));
}
