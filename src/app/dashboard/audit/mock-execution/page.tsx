"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TickSquare } from "iconsax-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditExecutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-blue-50 text-blue-800 px-3 py-1 rounded inline-flex uppercase">AVIONICS WORKSHOP</h1>
          <p className="text-muted-foreground mt-2">Running Inspection. Template Ref: Form: NG-QA-010 Rev: 06</p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <TickSquare size="20" variant="Outline" color="#fff" /> Submit Audit
        </Button>
      </div>

      <Card className="shadow-sm">
         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 rounded-lg border">
            <div>
              <Label className="text-xs text-slate-500 uppercase">Audit Ref No.</Label>
              <div className="font-semibold text-lg">AD6623</div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 uppercase">Location</Label>
              <div className="font-semibold">LAGOS</div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 uppercase">Auditor</Label>
              <div className="font-semibold">AKINNIRAN A B</div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 uppercase">Date</Label>
              <div className="font-semibold">28/9/23</div>
            </div>
         </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-800 text-white rounded-t-lg">
          <CardTitle className="text-center tracking-wider text-base uppercase">Personnel Section</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-24">Nig CARs</TableHead>
                <TableHead className="w-28">MPM/MCM</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[180px]">Auditor Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { n: "6.4.1.1e", m: "MPM 3.4.2.H", q: "Is the Shop Supervisor qualified as per MPM/MCM requirements?", default: "satisfactory" },
                { n: "6.4.1.1f", m: "MPM 3.4.2.j", q: "Does the Shop Supervisor have adequate licence / Authorisation?", default: "satisfactory" },
                { n: "6.4.1.1i", m: "MPM 1.5", q: "Are the shop supervisor and other departmental staff regularly trained?", default: "unsatisfactory" },
              ].map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono">{row.n}</TableCell>
                  <TableCell className="text-xs font-mono">{row.m}</TableCell>
                  <TableCell className="font-medium text-sm">{row.q}</TableCell>
                  <TableCell>
                    <Select defaultValue={row.default}>
                      <SelectTrigger className={`h-8 font-semibold ${row.default === 'unsatisfactory' ? 'border-red-300 bg-red-50 text-red-700' : 'border-green-300 bg-green-50 text-green-700'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="satisfactory" className="font-bold text-green-700">SAT</SelectItem>
                        <SelectItem value="unsatisfactory" className="font-bold text-red-700">UNSAT</SelectItem>
                        <SelectItem value="yes" className="font-bold text-blue-700">YES</SelectItem>
                        <SelectItem value="no" className="font-bold text-slate-700">NO</SelectItem>
                        <SelectItem value="na" className="font-bold text-slate-500">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
