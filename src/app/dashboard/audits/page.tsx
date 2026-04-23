"use client";

import React from "react";
import { DocumentText, TickCircle, TaskSquare, AddCircle, PlayCircle, StopCircle, Discover } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { AuditRecord } from "@/modules/audits/types";
import { getAuditColumns } from "@/modules/audits/columns";

import { useGetAuditsQuery, useGetAuditStatsQuery } from "@/redux/api/endpoints/auditEndpoints";

export default function AuditsHistoryPage() {
  const router = useRouter();

  const { data: auditsData, isLoading } = useGetAuditsQuery();
  const { data: statsData, isLoading: statsLoading } = useGetAuditStatsQuery();

  const audits = auditsData?.audits ?? [];
  const stats = statsData?.stats;

  const columns = getAuditColumns({
    onView: (id) => router.push(`/dashboard/audits/${id}`),
    onResume: (id) => router.push(`/dashboard/audits/${id}/execute`),
  });

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
          value={stats?.totalAuditsDone?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<TickCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Active / In-progress"
          value={stats?.activeAudits?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<PlayCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
        <StatCard
          title="Audit Locations"
          value={stats?.uniqueLocations?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<DocumentText size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
      </div>

      <div className="pt-4">
        <DataTable 
          columns={columns} 
          data={audits}
          isLoading={isLoading}
          searchKey="id" 
          searchPlaceholder="Search by Audit Ref Number..." 
          filterKey="location"
        />
      </div>
    </div>
  );
}
