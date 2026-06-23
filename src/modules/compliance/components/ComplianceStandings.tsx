"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Airplane, Routing } from "iconsax-react";
import { getRateColorClass } from "./ComplianceKPIs";

interface ComplianceStandingsProps {
  airlineStandings: any[];
  routeStandings: any[];
  isLoading: boolean;
}

export function ComplianceStandings({
  airlineStandings,
  routeStandings,
  isLoading,
}: ComplianceStandingsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Airline Standings */}
      <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background">
        <CardHeader className="border-b bg-muted/20 px-6 py-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Airplane size={18} variant="Outline" color="currentColor" className="text-primary" /> Airline Compliance Rankings
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
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-right px-6"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
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
            <Routing size={18} variant="Outline" color="currentColor" className="text-primary" /> Sector / Route Conformity Standings
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
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-right px-6"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
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
  );
}
