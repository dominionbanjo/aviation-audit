"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useGetDashboardChartsQuery } from "@/redux/api/endpoints/auditEndpoints";

export const AnalyticsCharts: React.FC = () => {
  const { data: charts, isLoading } = useGetDashboardChartsQuery();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[300px]" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Chart */}
      <Card className="bg-background shadow-sm border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Audit Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4 -ml-4 sm:ml-0 overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex items-end gap-2 px-8 pb-12">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="flex-1 w-full rounded-t-lg" style={{ height: `${20 + Math.random() * 60}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                  itemStyle={{ fontSize: "12px", fontWeight: "500" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "10px", marginBottom: "4px" }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: "10px", paddingTop: "20px" }} 
                />
                <Line type="monotone" name="SAT" dataKey="sat" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                <Line type="monotone" name="UNSAT" dataKey="unsat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Severity Chart */}
      <Card className="bg-background shadow-sm border-border relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Findings by Severity</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] w-full pt-4 pb-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
               <Skeleton className="h-[180px] w-[180px] rounded-full" />
               <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      itemStyle={{ fontSize: "12px", fontWeight: "500" }}
                    />
                    <Pie
                      data={charts?.severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {charts?.severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Inner text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl sm:text-3xl font-bold">{charts?.totalFindings ?? 0}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-3 w-full sm:w-auto px-4 sm:px-0">
                {charts?.severityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between sm:justify-start gap-4 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <div className="text-sm font-semibold">{item.name}</div>
                      </div>
                      <div className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded">{item.value}</div>
                  </div>
                ))}
                <div className="mt-2 pt-4 border-t border-border flex justify-center sm:justify-start">
                  <Link href="/dashboard/audits" className="text-xs text-primary font-bold uppercase tracking-wider flex items-center hover:opacity-80 transition-opacity">
                    Go to Audits <ArrowRight2 size="14" variant="Outline" color="currentColor" className="ml-2" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
