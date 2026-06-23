"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DocumentText,
  Airplane,
  Warning2,
  TickCircle,
  ArrowLeft2,
  ArrowRight2,
  DirectRight,
} from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { FormDatePicker } from "@/components/shared/FormDatePicker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { otpFormSchema, OtpFormValues, DEPT_OPTIONS } from "../types";

interface OtpFormProps {
  airlineOptions: Array<{ label: string; value: string }>;
  routeOptions: Array<{ label: string; value: string }>;
  delayCodeOptions: Array<{ label: string; value: string }>;
  onSubmit: (values: OtpFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function OtpForm({
  airlineOptions,
  routeOptions,
  delayCodeOptions,
  onSubmit,
  isSubmitting,
}: OtpFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

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

  const { watch, setValue, handleSubmit } = methods;

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
      return await methods.trigger(fieldsToValidate);
    }
    return true;
  };

  return (
    <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background">
      <CardHeader className="border-b bg-muted/20 px-6 py-5">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <DocumentText size={20} variant="Outline" color="currentColor" className="text-primary" /> SOP Questionnaire Form
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
                    className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
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
                    icon={<Airplane size={18} variant="Outline" color="currentColor" />}
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
                          <Warning2 size={14} variant="Outline" color="currentColor" /> Delayed
                        </>
                      ) : (
                        <>
                          <TickCircle size={14} variant="Outline" color="currentColor" /> On-Time
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
                className="h-10 px-5 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft2 size={16} variant="Outline" color="currentColor" /> Previous
              </Button>
              
              {currentStep < 6 ? (
                <Button
                  key="next-step-button"
                  type="button"
                  onClick={async () => {
                    const isValid = await validateStep(currentStep);
                    if (isValid) {
                      setCurrentStep(prev => Math.min(6, prev + 1));
                    }
                  }}
                  className="h-10 px-5 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step <ArrowRight2 size={16} variant="Outline" color="currentColor" />
                </Button>
              ) : (
                <Button
                  key="submit-sop-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : (
                    <>
                      Submit SOP Audit <DirectRight size={16} variant="Outline" color="currentColor" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
