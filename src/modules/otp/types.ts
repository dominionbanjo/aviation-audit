import * as z from "zod";

export const FALLBACK_AIRLINES = [
  { label: "Air Peace", value: "Air Peace" },
  { label: "Arik Air", value: "Arik Air" },
  { label: "Max Air", value: "Max Air" },
  { label: "Ibom Air", value: "Ibom Air" },
  { label: "United Nigeria", value: "United Nigeria" },
];

export const FALLBACK_ROUTES = [
  { label: "LOS-ABV (Lagos to Abuja)", value: "LOS-ABV" },
  { label: "ABV-LOS (Abuja to Lagos)", value: "ABV-LOS" },
  { label: "LOS-PHC (Lagos to Port Harcourt)", value: "LOS-PHC" },
];

export const FALLBACK_DELAY_CODES = [
  { label: "11 - Passenger Handling", value: "11" },
  { label: "31 - Aircraft Handling", value: "31" },
  { label: "41 - Maintenance", value: "41" },
  { label: "61 - Crew", value: "61" },
  { label: "71 - Weather", value: "71" },
  { label: "81 - ATC / Airport Restrictions", value: "81" },
  { label: "91 - Reactionary Delay", value: "91" },
];

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
