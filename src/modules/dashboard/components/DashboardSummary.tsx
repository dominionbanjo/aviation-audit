"use client";

import React from "react";
import { DocumentText, Warning2, ShieldTick } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { useGetDashboardSummaryQuery } from "@/redux/api/endpoints/auditEndpoints";

export const DashboardSummary: React.FC = () => {
  const { data: summary, isLoading } = useGetDashboardSummaryQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Audits"
        value={summary?.totalAudits ?? 0}
        isLoading={isLoading}
        icon={<DocumentText size="24" variant="Bold" color="currentColor" />}
        iconBgClass="bg-blue-500/10 border-blue-500/20"
        iconColorClass="text-blue-500"
      />
      <StatCard
        title="Open Findings"
        value={summary?.openFindings ?? 0}
        isLoading={isLoading}
        icon={<Warning2 size="24" variant="Bold" color="currentColor" />}
        iconBgClass="bg-amber-500/10 border-amber-500/20"
        iconColorClass="text-amber-500"
      />
      <StatCard
        title="Critical Findings"
        value={summary?.criticalFindings ?? 0}
        isLoading={isLoading}
        icon={<Warning2 size="24" variant="Bold" color="currentColor" />}
        iconBgClass="bg-red-500/10 border-red-500/20"
        iconColorClass="text-red-500"
      />
      <StatCard
        title="Compliance Score"
        value={summary?.complianceScore ?? "0%"}
        isLoading={isLoading}
        icon={<ShieldTick size="24" variant="Bold" color="currentColor" />}
        iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        iconColorClass="text-emerald-500"
      />
    </div>
  );
};
