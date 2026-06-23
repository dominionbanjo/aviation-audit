import { pgTable, varchar, timestamp, text, integer, boolean, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Airlines Entity ────────────────────────────────────────────────────────
export const airlines = pgTable("airlines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull().unique(),
  code: varchar("code", { length: 10 }).notNull().unique(), // e.g. APK, W3
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Routes Entity ──────────────────────────────────────────────────────────
export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  origin: varchar("origin", { length: 50 }).notNull(), // e.g. Lagos (LOS)
  destination: varchar("destination", { length: 50 }).notNull(), // e.g. Abuja (ABV)
  code: varchar("code", { length: 20 }).notNull().unique(), // e.g. LOS-ABV
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    originIdx: index("idx_routes_origin").on(table.origin),
    destinationIdx: index("idx_routes_destination").on(table.destination),
  };
});

// ─── Delay Categories Entity ────────────────────────────────────────────────
export const delayCategories = pgTable("delay_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(), // e.g. 11, 41, 71
  name: varchar("name").notNull(), // e.g. Passenger Handling, Maintenance
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    nameIdx: index("idx_delay_categories_name").on(table.name),
  };
});

// ─── Submitted OTP Records ──────────────────────────────────────────────────
export const otpRecords = pgTable("otp_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  flightNumber: varchar("flight_number", { length: 20 }).notNull(),
  aircraftRegistration: varchar("aircraft_registration", { length: 20 }).notNull(),
  aircraftType: varchar("aircraft_type", { length: 20 }).notNull(),
  airline: varchar("airline").notNull(),
  route: varchar("route").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  
  scheduledDeparture: timestamp("scheduled_departure", { withTimezone: true }).notNull(),
  actualDeparture: timestamp("actual_departure", { withTimezone: true }).notNull(),
  scheduledArrival: timestamp("scheduled_arrival", { withTimezone: true }).notNull(),
  actualArrival: timestamp("actual_arrival", { withTimezone: true }).notNull(),
  
  wasDelayed: boolean("was_delayed").notNull().default(false),
  delayMinutes: integer("delay_minutes").notNull().default(0),
  delayCode: varchar("delay_code", { length: 10 }),
  delayDescription: text("delay_description"),
  
  responsibleDepartment: varchar("responsible_department"),
  crewIssue: boolean("crew_issue").notNull().default(false),
  maintenanceIssue: boolean("maintenance_issue").notNull().default(false),
  groundHandlingIssue: boolean("ground_handling_issue").notNull().default(false),
  
  boardingDelay: integer("boarding_delay").default(0),
  refuelingDelay: integer("refueling_delay").default(0),
  pushbackDelay: integer("pushback_delay").default(0),
  crewReportingDelay: integer("crew_reporting_delay").default(0),
  maintenanceDelay: integer("maintenance_delay").default(0),
  baggageHandlingDelay: integer("baggage_handling_delay").default(0),
  
  wasSopFollowed: boolean("was_sop_followed").notNull().default(true),
  wasEscalationDone: boolean("was_escalation_done").notNull().default(false),
  wasDelayAvoidable: boolean("was_delay_avoidable").notNull().default(false),
  correctiveAction: text("corrective_action"),
  auditorRemarks: text("auditor_remarks"),
  
  auditorId: varchar("auditor_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    dateIdx: index("idx_otp_date").on(table.date),
    airlineIdx: index("idx_otp_airline").on(table.airline),
    routeIdx: index("idx_otp_route").on(table.route),
    delayCodeIdx: index("idx_otp_delay_code").on(table.delayCode),
    wasDelayedIdx: index("idx_otp_was_delayed").on(table.wasDelayed),
    flightNumberIdx: index("idx_otp_flight_number").on(table.flightNumber),
  };
});

export const otpRecordsRelations = relations(otpRecords, ({ one }) => ({
  auditor: one(users, {
    fields: [otpRecords.auditorId],
    references: [users.id],
  }),
}));

export type Airline = typeof airlines.$inferSelect;
export type InsertAirline = typeof airlines.$inferInsert;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

export type DelayCategory = typeof delayCategories.$inferSelect;
export type InsertDelayCategory = typeof delayCategories.$inferInsert;

export type OtpRecord = typeof otpRecords.$inferSelect;
export type InsertOtpRecord = typeof otpRecords.$inferInsert;
