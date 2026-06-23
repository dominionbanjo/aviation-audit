"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InfoCircle } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { OtpRecord } from "@/redux/api/endpoints/otpEndpoints";

interface ColumnActions {
  onViewDetails: (record: OtpRecord) => void;
}

export const getComplianceColumns = (actions: ColumnActions): ColumnDef<OtpRecord>[] => [
  {
    accessorKey: "date",
    header: "Audit Date",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(row.getValue("date")).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "flightNumber",
    header: "Flight No.",
    cell: ({ row }) => (
      <span className="font-bold text-foreground font-mono">{row.getValue("flightNumber")}</span>
    ),
  },
  {
    accessorKey: "airline",
    header: "Airline",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("airline")}</span>
    ),
  },
  {
    accessorKey: "route",
    header: "Sector",
    cell: ({ row }) => (
      <span className="font-mono bg-muted/60 px-2 py-0.5 rounded text-xs text-primary font-semibold">
        {row.getValue("route")}
      </span>
    ),
  },
  {
    accessorKey: "delayMinutes",
    header: "Delay Min",
    cell: ({ row }) => {
      const mins = row.getValue("delayMinutes") as number;
      return (
        <span className={`font-mono text-xs ${mins > 15 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
          {mins}m
        </span>
      );
    },
  },
  {
    accessorKey: "wasDelayed",
    header: "OTP Status",
    cell: ({ row }) => {
      const isDelayed = row.getValue("wasDelayed") as boolean;
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          isDelayed 
            ? "bg-red-500/10 text-red-500 border-red-500/20" 
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {isDelayed ? "Delayed" : "On-Time"}
        </span>
      );
    },
  },
  {
    accessorKey: "wasSopFollowed",
    header: "SOP Conformance",
    cell: ({ row }) => {
      const isSop = row.getValue("wasSopFollowed") as boolean;
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          isSop 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {isSop ? "Compliant" : "Non-Conformant"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.onViewDetails(row.original)}
          className="h-8 px-3 text-slate-400 hover:text-primary hover:bg-primary/10 gap-1 text-xs font-bold"
        >
          <InfoCircle size={14} variant="Outline" color="currentColor" className="h-3.5 w-3.5" />
          Details
        </Button>
      </div>
    ),
  },
];
