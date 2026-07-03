import * as z from "zod";

export const DEPT_OPTIONS = [
  { label: "OCC (Operations)", value: "OCC" },
  { label: "Ground Handling", value: "Ground Handling" },
  { label: "Maintenance / Engineering", value: "Maintenance" },
  { label: "Flight Operations / Crew", value: "Crew" },
  { label: "ATC / Airport Authority", value: "ATC" },
  { label: "Catering / Cabin Services", value: "Catering" },
  { label: "Security", value: "Security" },
  { label: "None / On-Time", value: "None" },
];

export const CHART_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6b7280"];

export const otpFormSchema = z.object({
  flightNumber: z.string().min(2, "Flight number is required (e.g. APK7120)"),
  aircraftRegistration: z.string().min(3, "Aircraft registration is required"),
  aircraftType: z.string().min(2, "Aircraft type is required (e.g. B737)"),
  airline: z.string().min(1, "Please select an airline"),
  route: z.string().min(1, "Please select a route"),
  date: z.string().min(1, "Flight date is required"),
  
  scheduledDeparture: z.string().min(1, "Scheduled departure time is required"),
  actualDeparture: z.string().min(1, "Actual departure time is required"),
  scheduledArrival: z.string().min(1, "Scheduled arrival time is required"),
  actualArrival: z.string().min(1, "Actual arrival time is required"),
  
  wasDelayed: z.boolean().default(false),
  delayMinutes: z.coerce.number().default(0),
  delayCode: z.string().optional().nullable(),
  delayDescription: z.string().optional().nullable(),
  
  responsibleDepartment: z.string().min(1, "Please select responsible department"),
  crewIssue: z.boolean().default(false),
  maintenanceIssue: z.boolean().default(false),
  groundHandlingIssue: z.boolean().default(false),
  
  boardingDelay: z.coerce.number().default(0),
  refuelingDelay: z.coerce.number().default(0),
  pushbackDelay: z.coerce.number().default(0),
  crewReportingDelay: z.coerce.number().default(0),
  maintenanceDelay: z.coerce.number().default(0),
  baggageHandlingDelay: z.coerce.number().default(0),
  
  wasSopFollowed: z.boolean().default(true),
  wasEscalationDone: z.boolean().default(false),
  wasDelayAvoidable: z.boolean().default(false),
  correctiveAction: z.string().optional().nullable(),
  auditorRemarks: z.string().optional().nullable(),
});

export type OtpFormValues = z.infer<typeof otpFormSchema>;
