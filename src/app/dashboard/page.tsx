"use client";

import Link from "next/link";
import { DocumentText, Warning2, ShieldTick, ArrowRight2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
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

const performanceData = [
  { month: "Oct", sat: 65, unsat: 35 },
  { month: "Nov", sat: 72, unsat: 28 },
  { month: "Dec", sat: 68, unsat: 32 },
  { month: "Jan", sat: 80, unsat: 20 },
  { month: "Feb", sat: 75, unsat: 25 },
  { month: "Mar", sat: 85, unsat: 15 },
];

const severityData = [
  { name: "Critical", value: 4, color: "#ef4444" }, // Red
  { name: "Major", value: 6, color: "#f59e0b" },    // Amber
  { name: "Minor", value: 3, color: "#3b82f6" },    // Blue
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Audits"
          value="56"
          icon={<DocumentText size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
        <StatCard
          title="Open Findings"
          value="13"
          icon={<Warning2 size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
        <StatCard
          title="Critical Findings"
          value="4"
          icon={<Warning2 size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-red-500/10 border-red-500/20"
          iconColorClass="text-red-500"
        />
        <StatCard
          title="Compliance Score"
          value="88%"
          icon={<ShieldTick size="24" variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audits Table */}
        <Card className="bg-background shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-lg font-bold">Recent Audits</CardTitle>
            <Link href="/dashboard/audits" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
              View All <ArrowRight2 size="14" className="ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground w-[120px]">Reference</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground">Location</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground w-[120px]">Date</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground text-right w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { ref: "AD5678", loc: "Lagos Avionics Workshop", date: "27 Apr 2024", status: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                  { ref: "AD1234", loc: "B737 MEL Review", date: "25 Apr 2024", status: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                  { ref: "AD0091", loc: "Cabin Crew Training", date: "20 Apr 2024", status: "In Progress", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                  { ref: "AD7685", loc: "Lagos Avionics Workshop", date: "18 Apr 2024", status: "On Hold", color: "bg-muted text-muted-foreground border-border" },
                ].map((item, i) => (
                  <TableRow key={i} className="border-border hover:bg-muted/20">
                    <TableCell className="px-6 font-mono text-sm font-semibold">{item.ref}</TableCell>
                    <TableCell className="px-6 font-medium text-sm">{item.loc}</TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground">{item.date}</TableCell>
                    <TableCell className="px-6 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Open Findings Table */}
        <Card className="bg-background shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-lg font-bold">Open Findings</CardTitle>
            <Link href="/dashboard/findings" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
              View All <ArrowRight2 size="14" className="ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground">Finding</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground w-[160px]">Audit</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground text-right w-[100px]">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { desc: "Smoke detectors unserviceable", audit: "Cabin Crew Facility", sev: "Critical", color: "text-red-500 bg-red-500/10 border-red-500/20" },
                  { desc: "Inadequate manpower", audit: "Lagos Avionics", sev: "Major", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                  { desc: "Calibration tools expired", audit: "B737 MEL Review", sev: "Minor", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                  { desc: "Improperly stored consumables", audit: "Lagos Avionics", sev: "Minor", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                ].map((item, i) => (
                  <TableRow key={i} className="border-border hover:bg-muted/20">
                    <TableCell className="px-6 text-sm font-medium">{item.desc}</TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground truncate max-w-[140px]">{item.audit}</TableCell>
                    <TableCell className="px-6 text-right">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                        {item.sev}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="bg-background shadow-sm border-border overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Audit Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] w-full pt-4 -ml-4 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                  tickFormatter={(val) => `${val}%`}
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
          </CardContent>
        </Card>

        {/* Severity Chart */}
        <Card className="bg-background shadow-sm border-border relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Findings by Severity</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] w-full pt-4 pb-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                    itemStyle={{ fontSize: "12px", fontWeight: "500" }}
                  />
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-bold">13</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-col gap-3 w-full sm:w-auto px-4 sm:px-0">
              {severityData.map((item) => (
                 <div key={item.name} className="flex items-center justify-between sm:justify-start gap-4 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="text-sm font-semibold">{item.name}</div>
                    </div>
                    <div className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded">{item.value}</div>
                 </div>
              ))}
              <div className="mt-2 pt-4 border-t border-border flex justify-center sm:justify-start">
                <Link href="/dashboard/reports" className="text-xs text-primary font-bold uppercase tracking-wider flex items-center hover:opacity-80 transition-opacity">
                  Generate Report <ArrowRight2 size="14" variant="Outline" className="ml-2" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
