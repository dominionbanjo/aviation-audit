"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Setting2, TickCircle, Warning2, TaskSquare } from "iconsax-react";
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
  useGetDelayCategoriesListQuery,
} from "@/redux/api/endpoints/entityEndpoints";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";

import { OtpAnalytics } from "@/modules/otp/components/OtpAnalytics";
import { OtpForm } from "@/modules/otp/components/OtpForm";
import { OtpFormValues } from "@/modules/otp/types";

export default function OTPPage() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isAdmin = user?.role === "ADMIN";

  // RTK Queries
  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetOtpSummaryQuery();
  const {
    data: airlines,
    isLoading: isAirlinesLoading,
    refetch: refetchAirlines,
  } = useGetOtpAirlinesQuery();
  const {
    data: delayCategories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useGetOtpDelayCategoriesQuery();
  const {
    data: routes,
    isLoading: isRoutesLoading,
    refetch: refetchRoutes,
  } = useGetOtpRoutesQuery();

  // Dynamic entities from CRUD tables
  const { data: dbAirlines } = useGetAirlinesListQuery();
  const { data: dbRoutes } = useGetRoutesListQuery();
  const { data: dbDelayCodes } = useGetDelayCategoriesListQuery();

  // Mutation
  const [submitOtp, { isLoading: isSubmitting }] =
    useSubmitOtpQuestionnaireMutation();

  const airlineList = airlines || [];
  const routeList = routes || [];

  // Memoized Options mapped to database entities
  const airlineOptions = useMemo(() => {
    const list = dbAirlines?.data ?? [];
    return list.map((a) => ({ label: `${a.name} (${a.code})`, value: a.name }));
  }, [dbAirlines]);

  const routeOptions = useMemo(() => {
    const list = dbRoutes?.data ?? [];
    return list.map((r) => ({
      label: `${r.origin} ➔ ${r.destination} (${r.code})`,
      value: r.code,
    }));
  }, [dbRoutes]);

  const delayCodeOptions = useMemo(() => {
    const list = dbDelayCodes?.data ?? [];
    return list.map((c) => ({ label: `${c.code} - ${c.name}`, value: c.code }));
  }, [dbDelayCodes]);

  // Form Submit
  const handleFormSubmit = async (values: OtpFormValues) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Extract flight date
      const flightDate = values.date.split("T")[0];
      const payload = {
        ...values,
        date: new Date(values.date).toISOString(),
        scheduledDeparture: new Date(
          `${flightDate}T${values.scheduledDeparture}:00.000Z`,
        ).toISOString(),
        actualDeparture: new Date(
          `${flightDate}T${values.actualDeparture}:00.000Z`,
        ).toISOString(),
        scheduledArrival: new Date(
          `${flightDate}T${values.scheduledArrival}:00.000Z`,
        ).toISOString(),
        actualArrival: new Date(
          `${flightDate}T${values.actualArrival}:00.000Z`,
        ).toISOString(),
        delayCode: values.delayMinutes > 15 ? values.delayCode : null,
      };

      await submitOtp(payload).unwrap();

      setSuccessMessage("Flight questionnaire audited & logged successfully.");

      // Auto-switch to dashboard and refetch
      setTimeout(() => {
        setActiveTab("dashboard");
        refetchSummary();
        refetchAirlines();
        refetchCategories();
        refetchRoutes();
        setSuccessMessage(null);
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        (err as { data?: { error?: string } }).data?.error ||
          "Failed to submit flight questionnaire. Check connections.",
      );
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
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Analytics Dashboard
              </button>
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "form"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Take OTP
              </button>
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/otp/delay-categories")}
                className="h-10 text-xs font-bold border-border shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Setting2 size={16} variant="Outline" color="currentColor" />{" "}
                Delay Codes
              </Button>
            )}
          </div>
        }
      />

      {/* SUCCESS/ERROR NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold rounded-xl flex items-center gap-3 animate-pulse">
          <TickCircle
            size={20}
            variant="Outline"
            color="currentColor"
            className="shrink-0"
          />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl flex items-center gap-3">
          <Warning2
            size={20}
            variant="Outline"
            color="currentColor"
            className="shrink-0"
          />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === "dashboard" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ready to submit OTP data?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log flight departure performance and delay details.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab("form")}
              className="gap-2 h-10 px-5 text-xs font-bold shadow-lg shadow-primary/20 cursor-pointer"
            >
              <TaskSquare size={16} variant="Bold" color="currentColor" /> Take OTP
            </Button>
          </div>
          <OtpAnalytics
            summary={summary}
            airlineList={airlineList}
            routeList={routeList}
            delayCategories={delayCategories || []}
            isSummaryLoading={isSummaryLoading}
            isAirlinesLoading={isAirlinesLoading}
            isCategoriesLoading={isCategoriesLoading}
            isRoutesLoading={isRoutesLoading}
          />
        </div>
      ) : (
        <OtpForm
          airlineOptions={airlineOptions}
          routeOptions={routeOptions}
          delayCodeOptions={delayCodeOptions}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
