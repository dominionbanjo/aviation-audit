"use client";

import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Airplane,
  ShieldTick,
  Warning2,
  Timer,
  StatusUp,
  ChartSquare,
  Graph,
  Hierarchy,
  Activity,
} from "iconsax-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../types";

interface OtpAnalyticsProps {
  summary: any;
  airlineList: any[];
  routeList: any[];
  delayCategories: any[];
  isSummaryLoading: boolean;
  isAirlinesLoading: boolean;
  isCategoriesLoading: boolean;
  isRoutesLoading: boolean;
}

export function OtpAnalytics({
  summary,
  airlineList,
  routeList,
  delayCategories,
  isSummaryLoading,
  isAirlinesLoading,
  isCategoriesLoading,
  isRoutesLoading,
}: OtpAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audited Flights"
          value={summary?.totalFlights ?? 0}
          icon={<Airplane size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/10"
          iconColorClass="text-blue-500"
          isLoading={isSummaryLoading}
        />
        <StatCard
          title="On-Time Performance (OTP)"
          value={`${summary?.otpPercentage ?? 100}%`}
          icon={<ShieldTick size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/10"
          iconColorClass="text-emerald-500"
          isLoading={isSummaryLoading}
        />
        <StatCard
          title="Delayed Flights"
          value={summary?.delayedFlights ?? 0}
          icon={<Warning2 size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-500"
          isLoading={isSummaryLoading}
        />
        <StatCard
          title="Average Departure Delay"
          value={`${summary?.averageDelay ?? 0} min`}
          icon={<Timer size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-amber-500/10"
          iconColorClass="text-amber-500"
          isLoading={isSummaryLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OTP Trend (Line) */}
        <Card className="lg:col-span-2 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <StatusUp size={18} variant="Outline" color="currentColor" className="text-primary" /> OTP Trend Analysis
              </CardTitle>
              <CardDescription className="text-[10px]">
                Chronological performance trends showing percentage of on-time departures.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            {isSummaryLoading ? (
              <div className="h-full w-full flex items-end gap-2 px-8 pb-12">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 w-full rounded-t-lg bg-muted/40" style={{ height: `${20 + Math.random() * 60}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.trend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="otp"
                    name="OTP %"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Delay Category Breakdown */}
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ChartSquare size={18} variant="Outline" color="currentColor" className="text-primary" /> Root Delay Categories
            </CardTitle>
            <CardDescription className="text-[10px]">
              Proportionate shares of verified operational delays.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
            {isCategoriesLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-[180px] w-[180px] rounded-full bg-muted/40" />
                <Skeleton className="h-4 w-24 bg-muted/40" />
              </div>
            ) : delayCategories && delayCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={delayCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {delayCategories.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(_val, entry: any) => (
                      <span className="text-[9px] font-semibold text-muted-foreground">
                        {entry.payload.name} ({entry.payload.value})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-muted-foreground p-8 flex flex-col items-center gap-2">
                <Activity size={32} variant="Outline" color="currentColor" className="text-slate-300" />
                <span>No active delay records to render breakdown.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Airline Leaderboard */}
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Graph size={18} variant="Outline" color="currentColor" className="text-primary" /> Airline Reliability Rankings
            </CardTitle>
            <CardDescription className="text-[10px]">
              Ranked by OTP. Standard departures &gt;15 minutes count as delay.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">Airline</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Flights Audited</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-right">OTP Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAirlinesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : airlineList.length > 0 ? (
                  airlineList.map((a, i) => (
                    <TableRow key={i} className="hover:bg-muted/10">
                      <TableCell className="font-bold text-xs">{a.airline}</TableCell>
                      <TableCell className="text-center text-xs">{a.totalFlights}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            a.otp >= 85
                              ? "bg-emerald-500/10 text-emerald-500"
                              : a.otp >= 70
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {a.otp}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                      No logged flights found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Hierarchy size={18} variant="Outline" color="currentColor" className="text-primary" /> Sector / Route Performance
            </CardTitle>
            <CardDescription className="text-[10px]">
              Aggregated schedules, on-time rates, and average delay by route.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">Sector</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Avg Delay</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-right">OTP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRoutesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : routeList.length > 0 ? (
                  routeList.map((r, i) => (
                    <TableRow key={i} className="hover:bg-muted/10">
                      <TableCell className="font-bold text-xs">{r.route}</TableCell>
                      <TableCell className="text-center text-xs font-mono">{r.avgDelay} min</TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            r.otp >= 85
                              ? "bg-emerald-500/10 text-emerald-500"
                              : r.otp >= 70
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {r.otp}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-xs py-8 text-muted-foreground">
                      No logged flight sectors.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
