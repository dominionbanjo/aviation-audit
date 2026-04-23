"use client";

import { DashboardSummary } from "@/modules/dashboard/components/DashboardSummary";
import { RecentActivity } from "@/modules/dashboard/components/RecentActivity";
import { AnalyticsCharts } from "@/modules/dashboard/components/AnalyticsCharts";

/**
 * Dashboard Overview Page
 * 
 * ARCHITECTURE: Broken down into modular components to handle granular 
 * loading states (Summary cards vs Activity tables vs Analytical charts).
 */
export default function DashboardPage() {
  return (
    <div className="space-y-10 pb-10">
      {/* 1. Statistics Summary (Cards) */}
      <DashboardSummary />

      {/* 2. Recent Activity (Audits & Findings) */}
      <RecentActivity />

      {/* 3. Data Analytics (Performance & Severity Charts) */}
      <AnalyticsCharts />
    </div>
  );
}
