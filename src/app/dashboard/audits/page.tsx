"use client";

import React from "react";
import { DocumentText, TickCircle, TaskSquare, AddCircle, PlayCircle, StopCircle, Discover } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const auditsData = [
  { id: "AD-20230928-0012", location: "LAGOS", templateId: "AVIONICS WORKSHOP", auditor: "AKINNIRAN A B", date: new Date("2023-09-28T10:00:00Z"), status: "Completed" },
  { id: "AD-20231015-0013", location: "ABUJA", templateId: "Boeing 737 Line Maint.", auditor: "DAVID O", date: new Date("2023-10-15T14:30:00Z"), status: "In-Progress" },
  { id: "AD-20231102-0014", location: "LAGOS", templateId: "Ground Support Eq.", auditor: "DOMINION B", date: new Date("2023-11-02T09:15:00Z"), status: "Completed" },
];

export const columns: ColumnDef<typeof auditsData[0]>[] = [
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
    accessorKey: "templateId",
    header: "Standard Form",
  },
  {
    accessorKey: "auditor",
    header: "Auditor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      if (s === "Completed") return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-500/10 flex w-fit items-center gap-1.5"><TickCircle size={12} variant="Bold"/> Completed</span>;
      if (s === "In-Progress") return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-500/10 flex w-fit items-center gap-1.5"><PlayCircle size={12} variant="Bold"/> Active</span>;
      return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-500/10 flex w-fit items-center gap-1.5"><StopCircle size={12} variant="Bold"/> Draft</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
           {row.getValue("status") === "Completed" ? (
             <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10">
               <DocumentText size={16} variant="Outline" color="currentColor" /> View Report
             </Button>
           ) : (
             <Button variant="ghost" size="sm" className="h-8 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10">
               <Discover size={16} variant="Outline" color="currentColor" /> Resume
             </Button>
           )}
        </div>
      );
    },
  },
];


export default function AuditsHistoryPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Archive</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historical records, in-progress audits, and past compliance reports.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/audits/take")} className="gap-2 h-10 shadow-lg" size="sm">
          <TaskSquare size={18} variant="Bold" color="currentColor" />
          Take Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Audits Done"
          value="1,248"
          icon={<TickCircle size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Active / In-progress"
          value="4"
          icon={<PlayCircle size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
        <StatCard
          title="Audit Locations"
          value="15"
          icon={<DocumentText size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
      </div>

      <div className="pt-4">
        <DataTable 
          columns={columns} 
          data={auditsData} 
          searchKey="id" 
          searchPlaceholder="Search by Audit Ref Number..." 
        />
      </div>
    </div>
  );
}
