"use client";

import { StatCard } from "@/components/shared/StatCard";
import { Activity, Timer, ShieldTick, Warning2 } from "iconsax-react";

// Threshold coloring helper for >=85% (Emerald), 70-85% (Amber), <70% (Red)
function getRateColorClass(rate: number, isLowerBetter = false) {
  if (isLowerBetter) {
    if (rate < 15) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (rate <= 30) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  } else {
    if (rate >= 85) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (rate >= 70) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  }
}

interface ComplianceKPIsProps {
  globalKpis: {
    total: number;
    otp: number;
    sop: number;
    preventable: number;
  };
  isLoading: boolean;
}

export function ComplianceKPIs({ globalKpis, isLoading }: ComplianceKPIsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Flight Audits"
        value={globalKpis.total.toString()}
        isLoading={isLoading}
        icon={<Activity size={24} variant="Bulk" color="currentColor" />}
        iconBgClass="bg-primary/10 border-primary/20"
        iconColorClass="text-primary"
      />
      <StatCard
        title="Global OTP Rate"
        value={`${globalKpis.otp}%`}
        isLoading={isLoading}
        icon={<Timer size={24} variant="Bulk" color="currentColor" />}
        iconBgClass="bg-blue-500/10 border-blue-500/20"
        iconColorClass="text-blue-500"
        description={
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRateColorClass(globalKpis.otp)}`}>
            {globalKpis.otp >= 85 ? "Optimal" : globalKpis.otp >= 70 ? "Warning" : "Critical"}
          </span>
        }
      />
      <StatCard
        title="SOP Compliance"
        value={`${globalKpis.sop}%`}
        isLoading={isLoading}
        icon={<ShieldTick size={24} variant="Bulk" color="currentColor" />}
        iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        iconColorClass="text-emerald-500"
        description={
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRateColorClass(globalKpis.sop)}`}>
            {globalKpis.sop >= 85 ? "Compliant" : globalKpis.sop >= 70 ? "Warning" : "Non-Conformant"}
          </span>
        }
      />
      <StatCard
        title="Preventable Delay Rate"
        value={`${globalKpis.preventable}%`}
        isLoading={isLoading}
        icon={<Warning2 size={24} variant="Bulk" color="currentColor" />}
        iconBgClass="bg-amber-500/10 border-amber-500/20"
        iconColorClass="text-amber-500"
        description={
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRateColorClass(globalKpis.preventable, true)}`}>
            {globalKpis.preventable < 15 ? "Low Risk" : globalKpis.preventable <= 30 ? "Medium Risk" : "High Risk"}
          </span>
        }
      />
    </div>
  );
}
export { getRateColorClass };
