"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DocumentText, PlayCircle, StopCircle, TickCircle, Discover } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { AuditRecord } from "./types";

interface ColumnActions {
  onView: (id: string) => void;
  onResume: (id: string) => void;
}

export const getAuditColumns = (actions: ColumnActions): ColumnDef<AuditRecord>[] => [
  {
    accessorKey: "id",
    header: "Audit Ref No",
    cell: ({ row }) => <span className="font-mono font-bold text-xs text-primary">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "date",
    header: "Date Executed",
    cell: ({ row }) => <span className="text-sm">{format(row.getValue("date"), "dd MMM, yyyy")}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "templateName",
    header: "Standard Form",
  },
  {
    accessorKey: "auditorName",
    header: "Auditor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      if (s === "Completed") return (
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-500/10 flex w-fit items-center gap-1.5">
          <TickCircle size={12} variant="Bold" color="currentColor" /> Completed
        </span>
      );
      if (s === "In-Progress") return (
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-500/10 flex w-fit items-center gap-1.5">
          <PlayCircle size={12} variant="Bold" color="currentColor" /> Active
        </span>
      );
      return (
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-500/10 flex w-fit items-center gap-1.5">
          <StopCircle size={12} variant="Bold" color="currentColor" /> Draft
        </span>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original.status;
      return (
        <div className="flex justify-end pr-4">
           {status === "Completed" ? (
             <Button 
               variant="ghost" size="sm" 
               className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10"
               onClick={() => actions.onView(id)}
             >
               <DocumentText size={16} variant="Outline" color="currentColor" /> View Report
             </Button>
           ) : (
             <Button 
               variant="ghost" size="sm" 
               className="h-8 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
               onClick={() => actions.onResume(id)}
             >
               <Discover size={16} variant="Outline" color="currentColor" /> Resume
             </Button>
           )}
        </div>
      );
    },
  },
];
