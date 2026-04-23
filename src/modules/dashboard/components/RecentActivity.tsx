"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardRecentQuery } from "@/redux/api/endpoints/auditEndpoints";

export const RecentActivity: React.FC = () => {
  const { data: recent, isLoading } = useGetDashboardRecentQuery();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Audits Table */}
      <Card className="bg-background shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-bold">Recent Audits</CardTitle>
          <Link href="/dashboard/audits" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
            View All <ArrowRight2 size="14" variant="Outline" color="currentColor" className="ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <TableSkeleton columns={4} rows={5} />
          ) : (
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
                {recent?.recentAudits.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-40 text-center text-muted-foreground">No recent audits found</TableCell></TableRow>
                ) : (
                  recent?.recentAudits.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-muted/20">
                      <TableCell className="px-6 font-mono text-sm font-semibold">{item.ref}</TableCell>
                      <TableCell className="px-6 font-medium text-sm">{item.loc}</TableCell>
                      <TableCell className="px-6 text-sm text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="px-6 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Findings Table */}
      <Card className="bg-background shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-bold">Recent Findings</CardTitle>
          <Link href="/dashboard/audits" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
            View All <ArrowRight2 size="14" variant="Outline" color="currentColor" className="ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <TableSkeleton columns={3} rows={5} />
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground">Finding</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground w-[160px]">Audit</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-xs uppercase tracking-widest text-muted-foreground text-right w-[100px]">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {recent?.recentFindings.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="h-40 text-center text-muted-foreground">No recent findings found</TableCell></TableRow>
                ) : (
                  recent?.recentFindings.map((item, i) => (
                    <TableRow key={i} className="border-border hover:bg-muted/20">
                      <TableCell className="px-6 text-sm font-medium">{item.desc}</TableCell>
                      <TableCell className="px-6 text-sm text-muted-foreground truncate max-w-[140px]">{item.audit}</TableCell>
                      <TableCell className="px-6 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                          {item.sev}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function TableSkeleton({ columns, rows }: { columns: number, rows: number }) {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-8 w-full bg-muted/50" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(columns)].map((__, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
