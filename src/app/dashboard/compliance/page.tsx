"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Info, 
  Calendar,
  Plane,
  Route,
  Activity,
  Award
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useGetOtpRecordsQuery, OtpRecord } from "@/redux/api/endpoints/otpEndpoints";

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

export default function CompliancePage() {
  const [selectedRecord, setSelectedRecord] = useState<OtpRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"audits" | "standings">("audits");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: allRecordsResponse } = useGetOtpRecordsQuery();
  const records = allRecordsResponse?.data ?? [];

  const { data: paginatedResponse, isLoading } = useGetOtpRecordsQuery({ page, limit, search });
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

  // 4. Columns for Flight Audit Logs table
  const columns: ColumnDef<OtpRecord>[] = [
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
            onClick={() => setSelectedRecord(row.original)}
            className="h-8 px-3 text-slate-400 hover:text-primary hover:bg-primary/10 gap-1 text-xs font-bold"
          >
            <Info size={14} className="h-3.5 w-3.5" />
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="OTP Compliance Dashboard"
        description="Monitor flight operational conformance metrics, procedural audits, and route delays."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Flight Audits"
          value={globalKpis.total.toString()}
          isLoading={isLoading}
          icon={<Activity className="h-6 w-6" />}
          iconBgClass="bg-primary/10 border-primary/20"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Global OTP Rate"
          value={`${globalKpis.otp}%`}
          isLoading={isLoading}
          icon={<Clock className="h-6 w-6" />}
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
          icon={<ShieldCheck className="h-6 w-6" />}
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
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
          description={
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRateColorClass(globalKpis.preventable, true)}`}>
              {globalKpis.preventable < 15 ? "Low Risk" : globalKpis.preventable <= 30 ? "Medium Risk" : "High Risk"}
            </span>
          }
        />
      </div>

      {/* Tabs Layout */}
      <div className="w-full space-y-6">
        <div className="bg-muted/40 p-1 border border-border/80 rounded-xl max-w-md w-full flex">
          <button
            onClick={() => setActiveTab("audits")}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${
              activeTab === "audits"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Flight Audits List
          </button>
          <button
            onClick={() => setActiveTab("standings")}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Airline Standings */}
            <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background">
              <CardHeader className="border-b bg-muted/20 px-6 py-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plane className="h-4.5 w-4.5 text-primary" /> Airline Compliance Rankings
                </CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground">
                  OTP, SOP adherence, and preventable delays by airline entity.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase px-6">Airline</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">Flights</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">OTP Rate</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">SOP Conform</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-right px-6">Preventable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                            Calculating airline performance rankings...
                          </TableCell>
                        </TableRow>
                      ) : airlineStandings.length > 0 ? (
                        airlineStandings.map((a, idx) => (
                          <TableRow key={idx} className="hover:bg-muted/10">
                            <TableCell className="font-bold text-xs px-6">{a.airline}</TableCell>
                            <TableCell className="text-center text-xs font-semibold">{a.total}</TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              <span className={`px-2 py-0.5 rounded font-bold ${getRateColorClass(a.otp)}`}>
                                {a.otp}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              <span className={`px-2 py-0.5 rounded font-bold ${getRateColorClass(a.sopRate)}`}>
                                {a.sopRate}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs px-6">
                              <span className={`px-2 py-0.5 rounded font-bold ${getRateColorClass(a.preventableRate, true)}`}>
                                {a.preventableRate}%
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                            No flight audit logs available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Route Standings */}
            <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background">
              <CardHeader className="border-b bg-muted/20 px-6 py-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Route className="h-4.5 w-4.5 text-primary" /> Sector / Route Conformity Standings
                </CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground">
                  OTP, SOP adherence, and average delay by sector code.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase px-6">Sector Code</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">Flights</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">OTP Rate</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-center">SOP Conform</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase text-right px-6">Avg Delay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                            Calculating route performance rankings...
                          </TableCell>
                        </TableRow>
                      ) : routeStandings.length > 0 ? (
                        routeStandings.map((r, idx) => (
                          <TableRow key={idx} className="hover:bg-muted/10">
                            <TableCell className="font-bold text-xs font-mono text-primary px-6">{r.route}</TableCell>
                            <TableCell className="text-center text-xs font-semibold">{r.total}</TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              <span className={`px-2 py-0.5 rounded font-bold ${getRateColorClass(r.otp)}`}>
                                {r.otp}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              <span className={`px-2 py-0.5 rounded font-bold ${getRateColorClass(r.sopRate)}`}>
                                {r.sopRate}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300 px-6">
                              {r.avgDelay}m
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                            No flight audit logs available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>

      {/* READ-ONLY AUDIT DETAILS POPUP MODAL */}
      <Modal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `OTP Audit: ${selectedRecord.flightNumber} Details` : ""}
        className="sm:max-w-[700px] overflow-hidden"
      >
        {selectedRecord && (
          <div className="space-y-6 pt-2 max-h-[80vh] overflow-y-auto pr-2">
            
            {/* Header badges */}
            <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border/50 pb-4">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block">Flight Date</span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
                  {new Date(selectedRecord.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  selectedRecord.wasDelayed 
                    ? "bg-red-500/10 text-red-500 border-red-500/20" 
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                }`}>
                  {selectedRecord.wasDelayed ? "Delayed" : "On-Time"}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  selectedRecord.wasSopFollowed 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}>
                  {selectedRecord.wasSopFollowed ? "SOP Followed" : "SOP Violation"}
                </span>
              </div>
            </div>

            {/* Flight info grid */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
                Flight Operations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-xl bg-muted/20">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Airline</span>
                  <span className="text-xs font-bold text-foreground block">{selectedRecord.airline}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Sector Route</span>
                  <span className="text-xs font-mono font-bold text-foreground block">{selectedRecord.route}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Aircraft Type</span>
                  <span className="text-xs font-bold text-foreground block">{selectedRecord.aircraftType}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Registration</span>
                  <span className="text-xs font-bold text-foreground block">{selectedRecord.aircraftRegistration}</span>
                </div>
              </div>
            </div>

            {/* Schedule times grid */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
                Scheduled vs Actual Dispatch
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 border rounded-xl bg-muted/20">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">STD (Sched Dep)</span>
                  <span className="text-xs font-mono font-bold">
                    {new Date(selectedRecord.scheduledDeparture).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">ATD (Actual Dep)</span>
                  <span className="text-xs font-mono font-bold">
                    {new Date(selectedRecord.actualDeparture).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">STA (Sched Arr)</span>
                  <span className="text-xs font-mono font-bold">
                    {new Date(selectedRecord.scheduledArrival).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">ATA (Actual Arr)</span>
                  <span className="text-xs font-mono font-bold">
                    {new Date(selectedRecord.actualArrival).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Delay Min</span>
                  <span className={`text-xs font-mono font-bold block ${selectedRecord.delayMinutes > 15 ? "text-red-500" : "text-emerald-500"}`}>
                    {selectedRecord.delayMinutes} Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Delay Info if delayed */}
            {selectedRecord.wasDelayed && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-2">
                  Delay & Classification Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-red-500/10 rounded-xl bg-red-500/5">
                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">IATA Delay Code</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      Code {selectedRecord.delayCode || "N/A"}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Reason Details</span>
                    <p className="text-xs text-foreground mt-0.5">
                      {selectedRecord.delayDescription || "No detailed delay explanation logged."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phase delays */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
                Phase-Specific Delays (Minutes)
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-4 border rounded-xl bg-muted/20 text-center">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Boarding</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.boardingDelay || 0}m</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Refueling</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.refuelingDelay || 0}m</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Pushback</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.pushbackDelay || 0}m</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Crew Chk</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.crewReportingDelay || 0}m</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Maint</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.maintenanceDelay || 0}m</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Baggage</span>
                  <span className="text-xs font-mono font-bold">{selectedRecord.baggageHandlingDelay || 0}m</span>
                </div>
              </div>
            </div>

            {/* Responsibility & flags */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-2">
                Responsibility & Corrective Plans
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Primary Department</span>
                    <span className="text-xs font-bold text-foreground">{selectedRecord.responsibleDepartment}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedRecord.crewIssue}
                        disabled
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      Crew Issue
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedRecord.maintenanceIssue}
                        disabled
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      Maint Issue
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedRecord.groundHandlingIssue}
                        disabled
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      Ground Issue
                    </label>
                  </div>
                </div>

                <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedRecord.wasEscalationDone}
                        disabled
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      Escalation Completed
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedRecord.wasDelayAvoidable}
                        disabled
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      Delay was Avoidable
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate CAR plan & Auditor Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-4">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Corrective Action Request (CAR)</span>
                <p className="text-xs text-foreground bg-muted/20 border p-3 rounded-lg mt-1 min-h-[60px]">
                  {selectedRecord.correctiveAction || "No immediate CAR required."}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Auditor Remarks</span>
                <p className="text-xs text-foreground bg-muted/20 border p-3 rounded-lg mt-1 min-h-[60px]">
                  {selectedRecord.auditorRemarks || "No compliance remarks logged."}
                </p>
              </div>
            </div>

            {/* Modal action */}
            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedRecord(null)}
                className="h-10 px-6 font-bold text-xs"
              >
                Close Audit View
              </Button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
