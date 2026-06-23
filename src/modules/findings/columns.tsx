"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Setting4 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { FindingRecord } from "@/redux/api/endpoints/findingsEndpoints";

interface ColumnActions {
  onManageCAR: (finding: FindingRecord) => void;
}

export const getFindingColumns = (actions: ColumnActions): ColumnDef<FindingRecord>[] => [
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
        onClick={() => actions.onManageCAR(row.original)}
        className="h-8 px-3 font-semibold text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-200"
      >
        <Setting4 size={14} variant="Outline" color="currentColor" className="mr-1.5" /> Manage CAR
      </Button>
    ),
  },
];
