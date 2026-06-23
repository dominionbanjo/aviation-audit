"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";

import { useGetOtpRecordsQuery, OtpRecord } from "@/redux/api/endpoints/otpEndpoints";
import { useDebounce } from "@/hooks/useDebounce";

import { getComplianceColumns } from "@/modules/compliance/columns";
import { ComplianceKPIs } from "@/modules/compliance/components/ComplianceKPIs";
import { ComplianceStandings } from "@/modules/compliance/components/ComplianceStandings";
import { ComplianceDetailsModal } from "@/modules/compliance/components/ComplianceDetailsModal";

export default function CompliancePage() {
  const [selectedRecord, setSelectedRecord] = useState<OtpRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"audits" | "standings">("audits");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data: allRecordsResponse } = useGetOtpRecordsQuery();
  const records = allRecordsResponse?.data ?? [];

  const { data: paginatedResponse, isLoading } = useGetOtpRecordsQuery({ page, limit, search: debouncedSearch });
  const paginatedRecords = paginatedResponse?.data ?? [];
  const pagination = paginatedResponse?.pagination;

  // 1. Calculate Global KPIs
  const globalKpis = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return { total: 0, otp: 100, sop: 100, preventable: 0 };
    }

    const delayed = records.filter(r => r.wasDelayed).length;
    const sopFollowed = records.filter(r => r.wasSopFollowed).length;
    const preventable = records.filter(r => r.wasDelayAvoidable).length;

    return {
      total,
      otp: Math.round(((total - delayed) / total) * 100),
      sop: Math.round((sopFollowed / total) * 100),
      preventable: Math.round((preventable / total) * 100),
    };
  }, [records]);

  // 2. Aggregate standings by Airline
  const airlineStandings = useMemo(() => {
    const statsMap: Record<string, {
      airline: string;
      total: number;
      delayed: number;
      sopFollowed: number;
      escalations: number;
      preventable: number;
    }> = {};

    records.forEach(r => {
      if (!statsMap[r.airline]) {
        statsMap[r.airline] = {
          airline: r.airline,
          total: 0,
          delayed: 0,
          sopFollowed: 0,
          escalations: 0,
          preventable: 0,
        };
      }
      const s = statsMap[r.airline];
      s.total += 1;
      if (r.wasDelayed) s.delayed += 1;
      if (r.wasSopFollowed) s.sopFollowed += 1;
      if (r.wasEscalationDone) s.escalations += 1;
      if (r.wasDelayAvoidable) s.preventable += 1;
    });

    return Object.values(statsMap).map(s => ({
      airline: s.airline,
      total: s.total,
      otp: Math.round(((s.total - s.delayed) / s.total) * 100),
      sopRate: Math.round((s.sopFollowed / s.total) * 100),
      escalationRate: Math.round((s.escalations / s.total) * 100),
      preventableRate: Math.round((s.preventable / s.total) * 100),
    })).sort((a, b) => b.otp - a.otp);
  }, [records]);

  // 3. Aggregate standings by Route Sector
  const routeStandings = useMemo(() => {
    const statsMap: Record<string, {
      route: string;
      total: number;
      delayed: number;
      sopFollowed: number;
      totalDelay: number;
    }> = {};

    records.forEach(r => {
      if (!statsMap[r.route]) {
        statsMap[r.route] = {
          route: r.route,
          total: 0,
          delayed: 0,
          sopFollowed: 0,
          totalDelay: 0,
        };
      }
      const s = statsMap[r.route];
      s.total += 1;
      if (r.wasDelayed) s.delayed += 1;
      if (r.wasSopFollowed) s.sopFollowed += 1;
      s.totalDelay += r.delayMinutes || 0;
    });

    return Object.values(statsMap).map(s => ({
      route: s.route,
      total: s.total,
      otp: Math.round(((s.total - s.delayed) / s.total) * 100),
      sopRate: Math.round((s.sopFollowed / s.total) * 100),
      avgDelay: Math.round(s.totalDelay / s.total),
    })).sort((a, b) => b.otp - a.otp);
  }, [records]);

  const columns = getComplianceColumns({
    onViewDetails: (record) => setSelectedRecord(record),
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="OTP Compliance Dashboard"
        description="Monitor flight operational conformance metrics, procedural audits, and route delays."
      />

      <ComplianceKPIs globalKpis={globalKpis} isLoading={isLoading} />

      {/* Tabs Layout */}
      <div className="w-full space-y-6">
        <div className="bg-muted/40 p-1 border border-border/80 rounded-xl max-w-md w-full flex">
          <button
            onClick={() => setActiveTab("audits")}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "audits"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Flight Audits List
          </button>
          <button
            onClick={() => setActiveTab("standings")}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "standings"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Operational Standings
          </button>
        </div>

        {/* Tab 1: Flight Audits List */}
        {activeTab === "audits" && (
          <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden p-6 pt-4">
            <DataTable
              columns={columns}
              data={paginatedRecords}
              isLoading={isLoading}
              searchKey="flightNumber"
              searchPlaceholder="Search audits by Flight Number..."
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
        )}

        {/* Tab 2: Operational Standings */}
        {activeTab === "standings" && (
          <ComplianceStandings
            airlineStandings={airlineStandings}
            routeStandings={routeStandings}
            isLoading={isLoading}
          />
        )}
      </div>

      <ComplianceDetailsModal
        selectedRecord={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
