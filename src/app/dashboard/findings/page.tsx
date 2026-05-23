"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sliders,
  Calendar,
  User,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import {
  useGetFindingsQuery,
  useGetFindingStatsQuery,
  useUpdateFindingMutation,
  FindingRecord,
} from "@/redux/api/endpoints/findingsEndpoints";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormSelect } from "@/components/shared/FormSelect";
import { FormDatePicker } from "@/components/shared/FormDatePicker";
import { Textarea } from "@/components/ui/textarea";
import { FormInput } from "@/components/shared/FormInput";

// ─── Constants for CAR Options ──────────────────────────────────────────────
const ROOT_CAUSE_OPTIONS = [
  { label: "Training / Knowledge Gap", value: "Training Gap" },
  { label: "Manpower Shortage", value: "Manpower Shortage" },
  { label: "Process / SOP Failure", value: "Process Failure" },
  { label: "Equipment / Tools Defect", value: "Equipment Failure" },
  { label: "Communication Breakdown", value: "Communication Breakdown" },
  { label: "Environmental / Weather Factors", value: "Weather" },
  { label: "Other / External Factors", value: "Other" },
];

const STATUS_OPTIONS = [
  { label: "Open (Unresolved)", value: "open" },
  { label: "Under Review (Remediated)", value: "under-review" },
  { label: "Closed (Verified & Settled)", value: "closed" },
];

interface CARFormValues {
  rootCause: string;
  correctiveAction: string;
  responsiblePerson: string;
  deadline: string | null;
  findingStatus: "open" | "under-review" | "closed";
}

export default function FindingsPage() {
  const [selectedFinding, setSelectedFinding] = useState<FindingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // Queries & Mutations
  const { data: findingsData, isLoading: isFindingsLoading } = useGetFindingsQuery({ page, limit, search });
  const { data: statsData, isLoading: isStatsLoading } = useGetFindingStatsQuery();
  const [updateFinding, { isLoading: isUpdating }] = useUpdateFindingMutation();

  const findingsList = findingsData?.data || [];
  const pagination = findingsData?.pagination;
  const stats = statsData?.stats;

  // React Hook Form
  const methods = useForm<CARFormValues>({
    defaultValues: {
      rootCause: "",
      correctiveAction: "",
      responsiblePerson: "",
      deadline: null,
      findingStatus: "open",
    },
  });

  // Open Modal and populate form fields
  const handleOpenCARModal = (finding: FindingRecord) => {
    setSelectedFinding(finding);
    methods.reset({
      rootCause: finding.rootCause || "",
      correctiveAction: finding.correctiveAction || "",
      responsiblePerson: finding.responsiblePerson || "",
      deadline: finding.deadline ? new Date(finding.deadline).toISOString() : null,
      findingStatus: finding.findingStatus || "open",
    });
    
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Submit CAR Updates
  const onSubmit = async (values: CARFormValues) => {
    if (!selectedFinding) return;

    try {
      setSuccessMessage(null);
      setErrorMessage(null);

      await updateFinding({
        id: selectedFinding.id,
        rootCause: values.rootCause || undefined,
        correctiveAction: values.correctiveAction || undefined,
        responsiblePerson: values.responsiblePerson || undefined,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        findingStatus: values.findingStatus,
      }).unwrap();

      setSuccessMessage("Corrective Action Request (CAR) details updated successfully.");
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedFinding(null);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.data?.error || "Failed to update CAR details. Check server connection.");
    }
  };

  // ─── Table Columns Definition ──────────────────────────────────────────────
  const columns: ColumnDef<FindingRecord>[] = [
    {
      accessorKey: "auditRefNo",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-bold text-sm text-foreground whitespace-nowrap">
          {row.getValue("auditRefNo")}
        </span>
      ),
    },
    {
      accessorKey: "auditLocation",
      header: "Location & Date",
      cell: ({ row }) => {
        const dateStr = row.original.auditDate;
        let formattedDate = "";
        try {
          if (dateStr) {
            formattedDate = new Date(dateStr).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        } catch {
          formattedDate = dateStr || "";
        }
        return (
          <div className="flex flex-col text-xs text-muted-foreground whitespace-nowrap">
            <span className="font-semibold text-foreground">{row.getValue("auditLocation")}</span>
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category & Checklist Question",
      cell: ({ row }) => (
        <div className="max-w-[320px] space-y-1">
          <span className="inline-block text-[10px] font-bold text-primary uppercase tracking-wider">
            {row.getValue("categoryName")}
          </span>
          <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-2" title={row.original.questionQuery}>
            {row.original.questionQuery}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "questionSeverity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("questionSeverity") as string;
        let colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        if (severity === "Critical") {
          colorClasses = "bg-red-500/10 text-red-500 border-red-500/20";
        } else if (severity === "Major") {
          colorClasses = "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}
          >
            {severity}
          </span>
        );
      },
    },
    {
      accessorKey: "findingStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("findingStatus") as string;
        let colorClasses = "bg-red-500/10 text-red-500 border-red-500/20";
        let label = "Open";
        
        if (status === "under-review") {
          colorClasses = "bg-amber-500/10 text-amber-500 border-amber-500/20";
          label = "Under Review";
        } else if (status === "closed") {
          colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
          label = "Closed";
        }
        
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenCARModal(row.original)}
          className="h-8 px-3 font-semibold text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-200"
        >
          <Sliders className="h-3.5 w-3.5 mr-1.5" /> Manage CAR
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Findings & Corrective Action Request (CAR) Tracker"
        description="Monitor non-compliances identified during standard aviation audits, assign corrective actions, and track closure status."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Audit Findings"
          value={stats?.openFindings ?? 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-500"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Under Review CARs"
          value={stats?.underReviewFindings ?? 0}
          icon={<Clock className="h-6 w-6" />}
          iconBgClass="bg-amber-500/10"
          iconColorClass="text-amber-500"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Closed & Resolved"
          value={stats?.closedFindings ?? 0}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Compliance Rating"
          value={stats?.complianceScore ?? "100%"}
          icon={<ShieldAlert className="h-6 w-6" />}
          iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
          isLoading={isStatsLoading}
        />
      </div>

      {/* Data Table */}
      <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" /> Active Findings Log
            </h2>
            <p className="text-xs text-muted-foreground">
              Lists non-compliance records from all checklists. Track roots and remediation.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={findingsList}
          isLoading={isFindingsLoading}
          searchKey="questionQuery"
          searchPlaceholder="Search non-compliances..."
          filterKey="findingStatus"
          filterOptions={[
            { label: "Open", value: "open" },
            { label: "Under Review", value: "under-review" },
            { label: "Closed", value: "closed" },
          ]}
          filterPlaceholder="All Statuses"
          searchVal={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          serverPagination={{
            currentPage: page,
            totalPages: pagination?.totalPages ?? 1,
            totalItems: pagination?.total ?? 0,
            limit: limit,
            onPageChange: (p) => setPage(p),
            onLimitChange: (l) => {
              setLimit(l);
              setPage(1);
            }
          }}
        />
      </div>

      {/* CAR MANAGEMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Corrective Action Plan (CAR)"
        className="sm:max-w-[550px]"
      >
        {selectedFinding && (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 pt-2">
              {/* Finding Description & Context */}
              <div className="space-y-3 p-4 bg-muted/40 border border-border/50 rounded-xl text-xs">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground">
                    Audit Ref: {selectedFinding.auditRefNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                      selectedFinding.questionSeverity === "Critical"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : selectedFinding.questionSeverity === "Major"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}
                  >
                    {selectedFinding.questionSeverity} Severity
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide mb-0.5">
                    Category / Checklist Item
                  </span>
                  <span className="font-bold text-primary block">{selectedFinding.categoryName}</span>
                  <p className="font-semibold text-foreground leading-relaxed mt-1">
                    {selectedFinding.questionQuery}
                  </p>
                  {selectedFinding.questionManualRef && (
                    <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                      Manual Reference: {selectedFinding.questionManualRef}
                    </span>
                  )}
                </div>
                {selectedFinding.comment && (
                  <div className="border-t border-border/50 pt-2">
                    <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide mb-0.5">
                      Auditor Comments / Field Findings
                    </span>
                    <p className="italic text-muted-foreground font-medium">{selectedFinding.comment}</p>
                  </div>
                )}
              </div>

              {/* Notifications */}
              {successMessage && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Input Form Fields */}
              <div className="space-y-4">
                {/* Root Cause Category */}
                <FormSelect
                  name="rootCause"
                  label="Root Cause Category"
                  options={ROOT_CAUSE_OPTIONS}
                  placeholder="Select Root Cause Reason"
                />

                {/* Action Plan Text */}
                <FormField
                  control={methods.control}
                  name="correctiveAction"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Corrective Action Request (CAR) Plan
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Detail the procedural updates, training changes, or technical steps being implemented..."
                          className="min-h-[90px] bg-background border-border"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* Assigned and Deadline row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    name="responsiblePerson"
                    label="Responsible Owner"
                    placeholder="Name / Department"
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                  />

                  <FormDatePicker
                    name="deadline"
                    label="Remediation Deadline"
                    placeholder="Pick target date"
                  />
                </div>

                {/* CAR Status */}
                <FormSelect
                  name="findingStatus"
                  label="Closure / Action Status"
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUpdating}
                  className="h-10 px-4 font-semibold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-10 px-5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center gap-1.5 rounded-lg"
                >
                  {isUpdating ? "Saving..." : "Save Action Plan"} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </Modal>
    </div>
  );
}
