"use client";

import React from "react";
import { Copy, DocumentText, SearchNormal1, AddCircle, Setting4, Edit2 } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Temporary mockup data
const templatesData = [
  { id: "TPL-001", name: "Boeing 737 Line Maintenance", type: "Line Station", regs: "NCAA / MPM", status: "Active" },
  { id: "TPL-002", name: "Avionics Workshop Audit", type: "Facility", regs: "Nig. CARs", status: "Draft" },
  { id: "TPL-003", name: "Ground Support Equipment", type: "Ramp", regs: "IATA ISAGO", status: "Archived" },
];

export const columns: ColumnDef<typeof templatesData[0]>[] = [
  {
    accessorKey: "id",
    header: "Ref ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Template Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "type",
    header: "Location Type",
  },
  {
    accessorKey: "regs",
    header: "Regulatory Base",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      const tClass = s === "Active" ? "text-emerald-500 bg-emerald-500/10" : s === "Draft" ? "text-amber-500 bg-amber-500/10" : "text-slate-500 bg-slate-500/10";
      return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tClass}`}>{s}</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2 text-muted-foreground">
           <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Duplicate">
             <Copy size={16} variant="Outline" color="currentColor" />
           </button>
           <button className="p-1.5 hover:bg-muted hover:text-primary rounded transition-colors" title="Edit">
             <Edit2 size={16} variant="Outline" color="currentColor" />
           </button>
        </div>
      );
    },
  },
];

export default function AuditTemplatesPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage standardized regulatory checklists and forms.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/audit/templates/new")} className="gap-2 h-10 shadow-lg" size="sm">
          <AddCircle size={18} variant="Bold" color="currentColor" />
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Templates"
          value="12"
          icon={<DocumentText size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
        <StatCard
          title="Draft Templates"
          value="3"
          icon={<Setting4 size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
        <StatCard
          title="Total Questions"
          value="486"
          icon={<SearchNormal1 size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
      </div>

      {/* Data Table Area */}
      <div className="pt-4">
        <DataTable 
          columns={columns} 
          data={templatesData} 
          searchKey="name" 
          searchPlaceholder="Search templates by name..." 
        />
      </div>
    </div>
  );
}
