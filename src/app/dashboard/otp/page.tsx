"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  FileText,
  Calendar,
  ShieldCheck,
  Send,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  ArrowLeft,
  Settings2,
} from "lucide-react";
import {
  useGetOtpSummaryQuery,
  useGetOtpAirlinesQuery,
  useGetOtpDelayCategoriesQuery,
  useGetOtpRoutesQuery,
  useSubmitOtpQuestionnaireMutation,
} from "@/redux/api/endpoints/otpEndpoints";
import { 
  useGetAirlinesListQuery, 
  useGetRoutesListQuery, 
  useGetDelayCategoriesListQuery 
} from "@/redux/api/endpoints/entityEndpoints";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { FormDatePicker } from "@/components/shared/FormDatePicker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// ─── Static Fallbacks ────────────────────────────────────────────────────────
const FALLBACK_AIRLINES = [
  { label: "Air Peace", value: "Air Peace" },
  { label: "Arik Air", value: "Arik Air" },
  { label: "Max Air", value: "Max Air" },
  { label: "Ibom Air", value: "Ibom Air" },
  { label: "United Nigeria", value: "United Nigeria" },
];

const FALLBACK_ROUTES = [
  { label: "LOS-ABV (Lagos to Abuja)", value: "LOS-ABV" },
  { label: "ABV-LOS (Abuja to Lagos)", value: "ABV-LOS" },
  { label: "LOS-PHC (Lagos to Port Harcourt)", value: "LOS-PHC" },
];

const FALLBACK_DELAY_CODES = [
  { label: "11 - Passenger Handling", value: "11" },
  { label: "31 - Aircraft Handling", value: "31" },
  { label: "41 - Maintenance", value: "41" },
  { label: "61 - Crew", value: "61" },
  { label: "71 - Weather", value: "71" },
  { label: "81 - ATC / Airport Restrictions", value: "81" },
  { label: "91 - Reactionary Delay", value: "91" },
];

const DEPT_OPTIONS = [
  { label: "OCC (Operations)", value: "OCC" },
  { label: "Ground Handling", value: "Ground Handling" },
  { label: "Maintenance / Engineering", value: "Maintenance" },
  { label: "Flight Operations / Crew", value: "Crew" },
  { label: "ATC / Airport Authority", value: "ATC" },
  { label: "Catering / Cabin Services", value: "Catering" },
  { label: "Security", value: "Security" },
  { label: "None / On-Time", value: "None" },
];

const CHART_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6b7280"];

// ─── Zod Schema for OTP Validation ──────────────────────────────────────────
const otpFormSchema = z.object({
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

type OtpFormValues = z.infer<typeof otpFormSchema>;

export default function OTPPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // RTK Queries
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useGetOtpSummaryQuery();
  const { data: airlines, isLoading: isAirlinesLoading, refetch: refetchAirlines } = useGetOtpAirlinesQuery();
  const { data: delayCategories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useGetOtpDelayCategoriesQuery();
  const { data: routes, isLoading: isRoutesLoading, refetch: refetchRoutes } = useGetOtpRoutesQuery();

  // Dynamic entities from CRUD tables
  const { data: dbAirlines } = useGetAirlinesListQuery();
  const { data: dbRoutes } = useGetRoutesListQuery();
  const { data: dbDelayCodes } = useGetDelayCategoriesListQuery();

  // Mutation
  const [submitOtp, { isLoading: isSubmitting }] = useSubmitOtpQuestionnaireMutation();

  const airlineList = airlines || [];
  const routeList = routes || [];

  // Memoized Options mapped to database entities with fallbacks
  const airlineOptions = useMemo(() => {
    const list = dbAirlines?.data ?? [];
    if (list.length === 0) return FALLBACK_AIRLINES;
    return list.map(a => ({ label: `${a.name} (${a.code})`, value: a.name }));
  }, [dbAirlines]);

  const routeOptions = useMemo(() => {
    const list = dbRoutes?.data ?? [];
    if (list.length === 0) return FALLBACK_ROUTES;
    return list.map(r => ({ label: `${r.origin} ➔ ${r.destination} (${r.code})`, value: r.code }));
  }, [dbRoutes]);

  const delayCodeOptions = useMemo(() => {
    const list = dbDelayCodes?.data ?? [];
    if (list.length === 0) return FALLBACK_DELAY_CODES;
    return list.map(c => ({ label: `${c.code} - ${c.name}`, value: c.code }));
  }, [dbDelayCodes]);

  // Form initialization
  const methods = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema) as any,
    defaultValues: {
      flightNumber: "",
      aircraftRegistration: "",
      aircraftType: "",
      airline: "",
      route: "",
      date: new Date().toISOString(),
      scheduledDeparture: "",
      actualDeparture: "",
      scheduledArrival: "",
      actualArrival: "",
      wasDelayed: false,
      delayMinutes: 0,
      delayCode: "",
      delayDescription: "",
      responsibleDepartment: "None",
      crewIssue: false,
      maintenanceIssue: false,
      groundHandlingIssue: false,
      boardingDelay: 0,
      refuelingDelay: 0,
      pushbackDelay: 0,
      crewReportingDelay: 0,
      maintenanceDelay: 0,
      baggageHandlingDelay: 0,
      wasSopFollowed: true,
      wasEscalationDone: false,
      wasDelayAvoidable: false,
      correctiveAction: "",
      auditorRemarks: "",
    },
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  // Watch scheduled and actual departure times to calculate delays automatically
  const schedDep = watch("scheduledDeparture");
  const actDep = watch("actualDeparture");

  useEffect(() => {
    if (schedDep && actDep) {
      try {
        const [sh, sm] = schedDep.split(":").map(Number);
        const [ah, am] = actDep.split(":").map(Number);

        if (!isNaN(sh) && !isNaN(sm) && !isNaN(ah) && !isNaN(am)) {
          const sMin = sh * 60 + sm;
          const aMin = ah * 60 + am;
          let diffMins = aMin - sMin;

          // Handle overnight wrap-around (if actual departure is on the next day and diff is negative)
          if (diffMins < -12 * 60) {
            diffMins += 24 * 60;
          }
          
          const delayMins = Math.max(0, diffMins);
          setValue("delayMinutes", delayMins);
          setValue("wasDelayed", delayMins > 15);
          
          if (delayMins > 15) {
            const currentDept = watch("responsibleDepartment");
            if (currentDept === "None" || !currentDept) {
              setValue("responsibleDepartment", "OCC");
            }
          } else {
            setValue("responsibleDepartment", "None");
            setValue("delayCode", "");
          }
        }
      } catch (err) {
        console.error("Failed to parse departure times:", err);
      }
    }
  }, [schedDep, actDep, setValue, watch]);

  // Step validation
  const validateStep = async (step: number) => {
    let fieldsToValidate: Array<keyof OtpFormValues> = [];
    if (step === 1) {
      fieldsToValidate = ["flightNumber", "aircraftRegistration", "aircraftType", "airline", "route", "date"];
    } else if (step === 2) {
      fieldsToValidate = ["scheduledDeparture", "actualDeparture", "scheduledArrival", "actualArrival"];
    } else if (step === 3) {
      if (watch("wasDelayed")) {
        fieldsToValidate = ["delayCode"];
      }
    } else if (step === 4) {
      fieldsToValidate = ["responsibleDepartment"];
    } else if (step === 5) {
      fieldsToValidate = ["boardingDelay", "refuelingDelay", "pushbackDelay", "crewReportingDelay", "maintenanceDelay", "baggageHandlingDelay"];
    }
    
    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      return isValid;
    }
    return true;
  };

  // Form Submit
  const onSubmit = async (values: OtpFormValues) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Extract flight date (ISO string from FormDatePicker)
      const flightDate = values.date.split("T")[0];
      const payload = {
        ...values,
        date: new Date(values.date).toISOString(),
        scheduledDeparture: new Date(`${flightDate}T${values.scheduledDeparture}:00.000Z`).toISOString(),
        actualDeparture: new Date(`${flightDate}T${values.actualDeparture}:00.000Z`).toISOString(),
        scheduledArrival: new Date(`${flightDate}T${values.scheduledArrival}:00.000Z`).toISOString(),
        actualArrival: new Date(`${flightDate}T${values.actualArrival}:00.000Z`).toISOString(),
        delayCode: values.delayMinutes > 15 ? values.delayCode : null,
      };

      await submitOtp(payload).unwrap();
      
      setSuccessMessage("Flight questionnaire audited & logged successfully.");
      reset();
      setCurrentStep(1);
      
      // Auto-switch to dashboard and refetch
      setTimeout(() => {
        setActiveTab("dashboard");
        refetchSummary();
        refetchAirlines();
        refetchCategories();
        refetchRoutes();
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.data?.error || "Failed to submit flight questionnaire. Check connections.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="On-Time Performance (OTP) Module"
        description="Monitor flight delays, compliance parameters, and audit dispatch reliability in real-time."
        action={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/50 max-w-sm w-full">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Analytics Dashboard
              </button>
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === "form"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Auditor SOP Form
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/otp/delay-categories")}
              className="h-10 text-xs font-bold border-border shrink-0 flex items-center gap-1.5"
            >
              <Settings2 className="h-4 w-4" /> Delay Codes
            </Button>
          </div>
        }
      />

      {/* SUCCESS/ERROR NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold rounded-xl flex items-center gap-3 animate-pulse">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === "dashboard" ? (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Audited Flights"
              value={summary?.totalFlights ?? 0}
              icon={<Plane className="h-6 w-6" />}
              iconBgClass="bg-blue-500/10"
              iconColorClass="text-blue-500"
              isLoading={isSummaryLoading}
            />
            <StatCard
              title="On-Time Performance (OTP)"
              value={`${summary?.otpPercentage ?? 100}%`}
              icon={<ShieldCheck className="h-6 w-6" />}
              iconBgClass="bg-emerald-500/10"
              iconColorClass="text-emerald-500"
              isLoading={isSummaryLoading}
            />
            <StatCard
              title="Delayed Flights"
              value={summary?.delayedFlights ?? 0}
              icon={<AlertTriangle className="h-6 w-6" />}
              iconBgClass="bg-red-500/10"
              iconColorClass="text-red-500"
              isLoading={isSummaryLoading}
            />
            <StatCard
              title="Average Departure Delay"
              value={`${summary?.averageDelay ?? 0} min`}
              icon={<Clock className="h-6 w-6" />}
              iconBgClass="bg-amber-500/10"
              iconColorClass="text-amber-500"
              isLoading={isSummaryLoading}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OTP Trend (Line) */}
            <Card className="lg:col-span-2 border-border/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" /> OTP Trend Analysis
                  </CardTitle>
                  <CardDescription className="text-[10px]">
                    Chronological performance trends showing percentage of on-time departures.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="otp"
                      name="OTP %"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Delay Category Breakdown */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <PieIcon className="h-4.5 w-4.5 text-primary" /> Root Delay Categories
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Proportionate shares of verified operational delays.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-center">
                {delayCategories && delayCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={delayCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {delayCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        formatter={(val, entry: any) => (
                          <span className="text-[9px] font-semibold text-muted-foreground">
                            {entry.payload.name} ({entry.payload.value})
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-xs text-muted-foreground p-8 flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 text-slate-300" />
                    <span>No active delay records to render breakdown.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Airline Leaderboard */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-primary" /> Airline Reliability Rankings
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Ranked by OTP. Standard departures &gt;15 minutes count as delay.
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[350px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] font-bold uppercase">Airline</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-center">Flights Audited</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">OTP Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isAirlinesLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                          Loading airline stats...
                        </TableCell>
                      </TableRow>
                    ) : airlineList.length > 0 ? (
                      airlineList.map((a, i) => (
                        <TableRow key={i} className="hover:bg-muted/10">
                          <TableCell className="font-bold text-xs">{a.airline}</TableCell>
                          <TableCell className="text-center text-xs">{a.totalFlights}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-xs">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                a.otp >= 85
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : a.otp >= 70
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {a.otp}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                          No logged flights found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Route Performance */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-primary" /> Sector / Route Performance
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Aggregated schedules, on-time rates, and average delay by route.
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[350px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] font-bold uppercase">Sector</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-center">Avg Delay</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">OTP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRoutesLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                          Loading route performance...
                        </TableCell>
                      </TableRow>
                    ) : routeList.length > 0 ? (
                      routeList.map((r, i) => (
                        <TableRow key={i} className="hover:bg-muted/10">
                          <TableCell className="font-bold text-xs">{r.route}</TableCell>
                          <TableCell className="text-center text-xs font-mono">{r.avgDelay} min</TableCell>
                          <TableCell className="text-right font-mono font-bold text-xs">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                r.otp >= 85
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : r.otp >= 70
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {r.otp}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                          No logged flight sectors.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background">
          <CardHeader className="border-b bg-muted/20 px-6 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> SOP Questionnaire Form
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Verify departure parameters, check procedural checklists, and log performance audit findings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Stepper Progress */}
                <div className="mb-8 bg-muted/40 p-4 border border-border/60 rounded-xl">
                  <div className="flex justify-between items-center relative">
                    {/* Progress Line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted-foreground/20 -z-10" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-10" 
                      style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                    />
                    
                    {[
                      { step: 1, title: "Flight Info" },
                      { step: 2, title: "Schedules" },
                      { step: 3, title: "Delays" },
                      { step: 4, title: "Responsibility" },
                      { step: 5, title: "Phases" },
                      { step: 6, title: "Compliance" }
                    ].map((s) => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={async () => {
                          if (s.step < currentStep || await validateStep(currentStep)) {
                            setCurrentStep(s.step);
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 focus:outline-none"
                      >
                        <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                          currentStep === s.step 
                            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md"
                            : currentStep > s.step
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-background border-border text-muted-foreground hover:border-muted-foreground/50"
                        }`}>
                          {currentStep > s.step ? "✓" : s.step}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                          currentStep === s.step ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {s.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1. Flight Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-primary pl-2 uppercase tracking-wide">
                      Section 1: Flight Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormInput
                        name="flightNumber"
                        label="Flight Number"
                        placeholder="e.g. APK7120"
                        icon={<Plane size={18} />}
                      />
                      <FormInput
                        name="aircraftRegistration"
                        label="Aircraft Registration"
                        placeholder="e.g. 5N-BKI"
                      />
                      <FormInput
                        name="aircraftType"
                        label="Aircraft Type"
                        placeholder="e.g. B737-800"
                      />
                      <FormSelect
                        name="airline"
                        label="Airline"
                        options={airlineOptions}
                        placeholder="Select Airline"
                      />
                      <FormSelect
                        name="route"
                        label="Route"
                        options={routeOptions}
                        placeholder="Select Sector / Route"
                      />
                      <FormDatePicker
                        name="date"
                        label="Date of Flight"
                        placeholder="Pick flight date"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Schedule Information */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-purple-500 pl-2 uppercase tracking-wide">
                      Section 2: Schedule & Dispatch Times
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormInput
                        name="scheduledDeparture"
                        type="time"
                        label="Scheduled Departure (STD)"
                      />
                      <FormInput
                        name="actualDeparture"
                        type="time"
                        label="Actual Departure (ATD)"
                      />
                      <FormInput
                        name="scheduledArrival"
                        type="time"
                        label="Scheduled Arrival (STA)"
                      />
                      <FormInput
                        name="actualArrival"
                        type="time"
                        label="Actual Arrival (ATA)"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Delay & Classification */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-amber-500 pl-2 uppercase tracking-wide">
                      Section 3: Delay & Code Classifications
                    </h3>
                    
                    <div className="p-4 bg-muted/40 border rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                          Auto-Calculated Delay
                        </span>
                        <span className="text-2xl font-bold font-mono">
                          {watch("delayMinutes")} Minutes
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                          Delayed Status (&gt;15 min)
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            watch("wasDelayed")
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {watch("wasDelayed") ? (
                            <>
                              <AlertTriangle className="h-3.5 w-3.5" /> Delayed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> On-Time
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {watch("wasDelayed") ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <FormSelect
                            name="delayCode"
                            label="IATA Delay Code"
                            options={delayCodeOptions}
                            placeholder="Select IATA Code"
                          />
                        </div>
                        <div className="md:col-span-8">
                          <FormField
                            control={methods.control}
                            name="delayDescription"
                            render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Detailed Delay Reason
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Describe the operational causes for this delay..."
                                    className="min-h-[70px] bg-background border-border"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-500/5 text-emerald-600 text-xs font-semibold rounded-lg border border-emerald-500/10">
                        Flight is on time. No IATA delay code registration required for this log.
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Operational Responsibility */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-red-500 pl-2 uppercase tracking-wide">
                      Section 4: Operational Responsibility
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <FormSelect
                        name="responsibleDepartment"
                        label="Primary Responsible Department"
                        options={DEPT_OPTIONS}
                        placeholder="Select Department"
                      />

                      <div className="flex flex-col gap-2 p-2 border rounded-lg bg-muted/20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          Staff & Crew Issues?
                        </span>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("crewIssue")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          Crew Reporting/Hours
                        </label>
                      </div>

                      <div className="flex flex-col gap-2 p-2 border rounded-lg bg-muted/20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          Technical Issues?
                        </span>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("maintenanceIssue")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          Maintenance / Technical
                        </label>
                      </div>

                      <div className="flex flex-col gap-2 p-2 border rounded-lg bg-muted/20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          Ramp & Ground Issues?
                        </span>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("groundHandlingIssue")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          Ground Handling Agent
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Operational Phase Delays */}
                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-indigo-500 pl-2 uppercase tracking-wide">
                      Section 5: Phase-Specific Duration Analysis (in Minutes)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <FormInput name="boardingDelay" type="number" label="Boarding" min="0" />
                      <FormInput name="refuelingDelay" type="number" label="Refueling" min="0" />
                      <FormInput name="pushbackDelay" type="number" label="Pushback" min="0" />
                      <FormInput name="crewReportingDelay" type="number" label="Crew Check" min="0" />
                      <FormInput name="maintenanceDelay" type="number" label="Tech Work" min="0" />
                      <FormInput name="baggageHandlingDelay" type="number" label="Baggage" min="0" />
                    </div>
                  </div>
                )}

                {/* 6. Compliance & Audit */}
                {currentStep === 6 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <h3 className="text-sm font-bold text-foreground border-l-4 border-emerald-500 pl-2 uppercase tracking-wide">
                      Section 6: Compliance Controls & CAR Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3 p-4 border rounded-xl bg-muted/30">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                          Regulatory Flags
                        </span>
                        <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("wasSopFollowed")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          SOP Followed (NCAA/Company)
                        </label>
                        <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("wasEscalationDone")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          OCC Escalation Performed
                        </label>
                        <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            {...methods.register("wasDelayAvoidable")}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                          />
                          Delay was Preventable
                        </label>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <FormField
                          control={methods.control}
                          name="correctiveAction"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Immediate Corrective Action Request (CAR)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Describe the action plan requested to prevent this delay in future schedules..."
                                  className="min-h-[70px] bg-background border-border"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="auditorRemarks"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Auditor Compliance Remarks
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Write any internal audits, regulatory discrepancies, or general findings..."
                                  className="min-h-[70px] bg-background border-border"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Stepper Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    className="h-10 px-5 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Button>
                  
                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await validateStep(currentStep);
                        if (isValid) {
                          setCurrentStep(prev => Math.min(6, prev + 1));
                        }
                      }}
                      className="h-10 px-5 font-bold text-xs flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center gap-1.5"
                    >
                      {isSubmitting ? "Submitting..." : (
                        <>
                          Submit SOP Audit <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
