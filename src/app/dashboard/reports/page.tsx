"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Activity, 
  Database, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormSelect } from "@/components/shared/FormSelect";
import { FormInput } from "@/components/shared/FormInput";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetAuditsQuery } from "@/redux/api/endpoints/auditEndpoints";
import { useGetFindingsQuery } from "@/redux/api/endpoints/findingsEndpoints";
import { useGetOtpRecordsQuery } from "@/redux/api/endpoints/otpEndpoints";

// Memory-efficient Blob exporter for streaming large datasets to Excel-compatible CSVs
function exportToCsv(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  // Extract columns
  const headers = Object.keys(data[0]);
  
  // Build CSV string using chunking (streaming-ready)
  const csvChunks: string[] = [];
  csvChunks.push(headers.join(","));

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowString = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      // Escape double quotes by doubling them
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    }).join(",");
    csvChunks.push(rowString);
  }

  const csvContent = csvChunks.join("\r\n");
  
  // Include UTF-8 BOM (\ufeff) to make Excel parse the UTF-8 CSV automatically
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Free memory
}

interface ExportHistoryItem {
  id: string;
  filename: string;
  format: string;
  status: string;
  compiledDate: string;
  type: "audits" | "otp" | "findings";
}

const DATE_FILTER_OPTIONS = [
  { label: "All Dates", value: "all" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Year to Date (YTD)", value: "ytd" },
];

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<"audits" | "otp" | "findings">("audits");

  const [exportLogs, setExportLogs] = useState<ExportHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aqsams_export_logs");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: "1",
        filename: "safety_audits_history_full.csv",
        format: "Excel CSV",
        status: "Compiled",
        compiledDate: "Today, 08:44 AM",
        type: "audits"
      },
      {
        id: "2",
        filename: "otp_records_q1_summary.csv",
        format: "Excel CSV",
        status: "Compiled",
        compiledDate: "Yesterday, 04:12 PM",
        type: "otp"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("aqsams_export_logs", JSON.stringify(exportLogs));
  }, [exportLogs]);

  const [exportCount, setExportCount] = useState(exportLogs.length);

  const methods = useForm({
    defaultValues: {
      searchQuery: "",
      dateFilter: "all" as "all" | "30days" | "ytd",
    }
  });

  const searchQuery = methods.watch("searchQuery");
  const dateFilter = methods.watch("dateFilter");

  // Fetch all live records
  const { data: auditsData, isLoading: isAuditsLoading } = useGetAuditsQuery();
  const { data: findingsData, isLoading: isFindingsLoading } = useGetFindingsQuery();
  const { data: otpRecords, isLoading: isOtpLoading } = useGetOtpRecordsQuery();

  const audits = auditsData?.data ?? [];
  const findings = findingsData?.data ?? [];
  const otpLogs = otpRecords?.data ?? [];

  // Filter thresholds
  const dateLimit = useMemo(() => {
    if (dateFilter === "all") return null;
    const now = new Date();
    if (dateFilter === "30days") {
      return new Date(now.setDate(now.getDate() - 30));
    }
    if (dateFilter === "ytd") {
      return new Date(now.getFullYear(), 0, 1);
    }
    return null;
  }, [dateFilter]);

  // 1. Format and Filter Audits List
  const formattedAudits = useMemo(() => {
    let list = audits.map(a => ({
      "Audit Ref": a.refNo,
      "Location/Facility": a.location,
      "Template": a.templateName || "General Safety",
      "Date": new Date(a.date).toLocaleDateString("en-GB"),
      "Status": a.status === "Completed" ? "Completed" : "In Progress",
      "Auditor": a.auditorName || "N/A"
    }));

    if (dateLimit) {
      list = list.filter(item => {
        const parts = item.Date.split("/");
        const dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return dateObj >= dateLimit;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item["Audit Ref"].toLowerCase().includes(q) || 
        item["Location/Facility"].toLowerCase().includes(q) ||
        item["Template"].toLowerCase().includes(q)
      );
    }

    return list;
  }, [audits, searchQuery, dateLimit]);

  // 2. Format and Filter OTP List
  const formattedOtp = useMemo(() => {
    let list = otpLogs.map(o => ({
      "Date": new Date(o.date).toLocaleDateString("en-GB"),
      "Flight Number": o.flightNumber,
      "Airline": o.airline,
      "Sector Route": o.route,
      "STD": new Date(o.scheduledDeparture).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
      "ATD": new Date(o.actualDeparture).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
      "Delay Minutes": o.delayMinutes,
      "SOP Compliant": o.wasSopFollowed ? "Yes" : "No",
      "Preventable": o.wasDelayAvoidable ? "Yes" : "No"
    }));

    if (dateLimit) {
      list = list.filter(item => {
        const parts = item.Date.split("/");
        const dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return dateObj >= dateLimit;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item["Flight Number"].toLowerCase().includes(q) || 
        item["Airline"].toLowerCase().includes(q) ||
        item["Sector Route"].toLowerCase().includes(q)
      );
    }

    return list;
  }, [otpLogs, searchQuery, dateLimit]);

  // 3. Format and Filter Findings List
  const formattedFindings = useMemo(() => {
    let list = findings.map(f => ({
      "Audit Ref": f.auditRefNo,
      "Location": f.auditLocation,
      "Category": f.categoryName,
      "Severity": f.questionSeverity,
      "Finding Status": f.findingStatus.toUpperCase(),
      "Root Cause": f.rootCause || "Unassigned",
      "Corrective Action": f.correctiveAction || "Pending CAR",
      "Deadline": f.deadline ? new Date(f.deadline).toLocaleDateString("en-GB") : "Unscheduled"
    }));

    if (dateLimit) {
      list = list.filter(item => {
        const fRecord = findings.find(f => f.auditRefNo === item["Audit Ref"]);
        if (!fRecord) return true;
        return new Date(fRecord.auditDate) >= dateLimit;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item["Audit Ref"].toLowerCase().includes(q) || 
        item["Location"].toLowerCase().includes(q) ||
        item["Category"].toLowerCase().includes(q)
      );
    }

    return list;
  }, [findings, searchQuery, dateLimit]);

  // Dynamic values based on active tab
  const activeReportInfo = useMemo(() => {
    switch (selectedReportType) {
      case "otp":
        return {
          title: "OTP Performance Log",
          description: "Flight On-Time Performance (OTP) durations, responsible departments, SOP checks, and preventable delays.",
          filename: `otp_performance_report_${new Date().toISOString().split('T')[0]}.csv`,
          data: formattedOtp,
          loading: isOtpLoading
        };
      case "findings":
        return {
          title: "Safety Findings & CAR Log",
          description: "Regulatory non-compliances, inspector findings, severity levels, root causes, and corrective action programs.",
          filename: `safety_findings_car_log_${new Date().toISOString().split('T')[0]}.csv`,
          data: formattedFindings,
          loading: isFindingsLoading
        };
      case "audits":
      default:
        return {
          title: "Safety Audits Summary",
          description: "Consolidated audit completions history, airport locations, auditor assignments, and progress tracking.",
          filename: `safety_audits_summary_${new Date().toISOString().split('T')[0]}.csv`,
          data: formattedAudits,
          loading: isAuditsLoading
        };
    }
  }, [selectedReportType, formattedAudits, formattedOtp, formattedFindings, isAuditsLoading, isOtpLoading, isFindingsLoading]);

  // Handle download trigger
  const handleExport = () => {
    const filename = activeReportInfo.filename;
    window.location.href = `/api/reports/download-stream?type=${selectedReportType}`;
    
    const newLog: ExportHistoryItem = {
      id: Date.now().toString(),
      filename,
      format: "Excel CSV",
      status: "Compiled",
      compiledDate: new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      type: selectedReportType
    };
    
    setExportLogs(prev => [newLog, ...prev]);
    setExportCount(prev => prev + 1);
  };

  // Handle PDF Print
  const handlePrint = () => {
    window.print();
  };

  // Overall counts for KPI metrics
  const totalRecordsCount = audits.length + findings.length + otpLogs.length;

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      
      {/* Page Header (Hidden when printing) */}
      <div className="print:hidden">
        <PageHeader
          title="Intelligence & Reporting"
          description="Consolidated analytical workspace to export standard safety logs and flight reliability records."
        />
      </div>

      {/* Print-Only Custom Header */}
      <div className="hidden print:block border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Aviation Compliance Registry</h1>
        <p className="text-xs text-muted-foreground mt-1">Official Intelligence & Audit Report Summary</p>
        <div className="grid grid-cols-3 gap-4 mt-4 text-[10px] uppercase font-mono">
          <div>Report Title: <span className="font-bold text-slate-800">{activeReportInfo.title}</span></div>
          <div>Total Records: <span className="font-bold text-slate-800">{activeReportInfo.data.length}</span></div>
          <div>Printed Date: <span className="font-bold text-slate-800">{new Date().toLocaleString("en-GB")}</span></div>
        </div>
      </div>

      {/* KPI Summary Cards (Hidden when printing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        <StatCard
          title="Total System Records"
          value={totalRecordsCount.toString()}
          icon={<Database className="h-6 w-6" />}
          iconBgClass="bg-primary/10 border-primary/20"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Scheduled Reports"
          value="4 Active"
          icon={<Calendar className="h-6 w-6" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
          description={<span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Daily & Weekly</span>}
        />
        <StatCard
          title="Reports Exported"
          value={exportCount.toString()}
          icon={<Download className="h-6 w-6" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
          description={<span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">This Session</span>}
        />
        <StatCard
          title="Last Updated"
          value="Just Now"
          icon={<Clock className="h-6 w-6" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
          description={<span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Database Synced</span>}
        />
      </div>

      {/* Report Template Selector Grid (Hidden when printing) */}
      <div className="space-y-3 print:hidden">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Select Report Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Safety Audits */}
          <Card 
            onClick={() => setSelectedReportType("audits")}
            className={`cursor-pointer transition-all border shadow-sm hover:border-primary/40 ${
              selectedReportType === "audits" 
                ? "ring-2 ring-primary border-primary bg-primary/5" 
                : "border-border/80 bg-background"
            }`}
          >
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className={`h-4.5 w-4.5 ${selectedReportType === "audits" ? "text-primary" : "text-slate-400"}`} />
                Safety Audit Summaries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[10px] text-muted-foreground">
                Consolidated audit history, checklist compliance rates, inspector names, and completion status.
              </p>
              <div className="mt-3 flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Database Count</span>
                <span className="font-bold text-foreground">{audits.length} Records</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: OTP Log */}
          <Card 
            onClick={() => setSelectedReportType("otp")}
            className={`cursor-pointer transition-all border shadow-sm hover:border-primary/40 ${
              selectedReportType === "otp" 
                ? "ring-2 ring-primary border-primary bg-primary/5" 
                : "border-border/80 bg-background"
            }`}
          >
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className={`h-4.5 w-4.5 ${selectedReportType === "otp" ? "text-primary" : "text-slate-400"}`} />
                OTP Performance Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[10px] text-muted-foreground">
                Detailed flight dispatches, departure delay minutes, IATA delay codes, and preventable delay indicators.
              </p>
              <div className="mt-3 flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Database Count</span>
                <span className="font-bold text-foreground">{otpLogs.length} Records</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: CAR Findings */}
          <Card 
            onClick={() => setSelectedReportType("findings")}
            className={`cursor-pointer transition-all border shadow-sm hover:border-primary/40 ${
              selectedReportType === "findings" 
                ? "ring-2 ring-primary border-primary bg-primary/5" 
                : "border-border/80 bg-background"
            }`}
          >
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className={`h-4.5 w-4.5 ${selectedReportType === "findings" ? "text-primary" : "text-slate-400"}`} />
                Findings & CAR Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[10px] text-muted-foreground">
                Actionable audit violations, corrective action request plans, root causes, and remediation deadlines.
              </p>
              <div className="mt-3 flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Database Count</span>
                <span className="font-bold text-foreground">{findings.length} Records</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Main Report Builder Panel */}
      <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
        
        {/* Table Filter Controls Header (Hidden when printing) */}
        <div className="p-5 border-b border-border/80 flex flex-wrap gap-4 items-center justify-between bg-muted/10 print:hidden">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">{activeReportInfo.title}</h2>
            <p className="text-[10px] text-muted-foreground">{activeReportInfo.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            
            <FormProvider {...methods}>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Quick Search */}
                <div className="w-48 sm:w-64">
                  <FormInput
                    name="searchQuery"
                    placeholder="Filter preview data..."
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                    className="h-9 text-xs pl-10 bg-background animate-none"
                  />
                </div>

                {/* Quick Date filter */}
                <div className="w-36">
                  <FormSelect
                    name="dateFilter"
                    options={DATE_FILTER_OPTIONS}
                    triggerClassName="h-9 text-xs bg-background"
                  />
                </div>
              </div>
            </FormProvider>

            {/* Export trigger */}
            <Button
              onClick={handleExport}
              disabled={activeReportInfo.data.length === 0}
              className="h-9 px-4 text-xs font-bold gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export Excel (CSV)
            </Button>

            {/* Print/PDF trigger */}
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={activeReportInfo.data.length === 0}
              className="h-9 px-4 text-xs font-bold gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Print PDF
            </Button>

          </div>
        </div>

        {/* Dynamic preview list */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  {activeReportInfo.data.length > 0 && Object.keys(activeReportInfo.data[0]).map((header, idx) => (
                    <TableHead 
                      key={idx} 
                      className={`text-[10px] font-bold uppercase py-3 whitespace-nowrap ${idx === 0 ? "pl-6" : ""} ${idx === Object.keys(activeReportInfo.data[0]).length - 1 ? "pr-6 text-right" : ""}`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeReportInfo.loading ? (
                  Array.from({ length: 5 }).map((_, rIdx) => (
                    <TableRow key={rIdx}>
                      {Array.from({ length: activeReportInfo.data.length > 0 ? Object.keys(activeReportInfo.data[0]).length : 6 }).map((_, cIdx) => (
                        <TableCell key={cIdx} className="py-4 px-6">
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : activeReportInfo.data.length > 0 ? (
                  activeReportInfo.data.slice(0, 15).map((row, rowIdx) => (
                    <TableRow key={rowIdx} className="hover:bg-muted/10">
                      {Object.values(row).map((val, colIdx) => (
                        <TableCell 
                          key={colIdx} 
                          className={`text-xs py-3.5 ${colIdx === 0 ? "pl-6 font-semibold" : ""} ${colIdx === Object.keys(row).length - 1 ? "pr-6 text-right" : ""}`}
                        >
                          {colIdx === 0 && selectedReportType === "audits" ? (
                            <span className="font-mono font-bold text-foreground">{String(val)}</span>
                          ) : colIdx === 0 && selectedReportType === "otp" ? (
                            <span className="text-muted-foreground whitespace-nowrap">{String(val)}</span>
                          ) : String(val) === "Completed" || String(val) === "COMPLIANT" || String(val) === "CLOSED" || String(val) === "Yes" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {String(val)}
                            </span>
                          ) : String(val) === "In Progress" || String(val) === "UNDER-REVIEW" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              {String(val)}
                            </span>
                          ) : String(val) === "No" || String(val) === "OPEN" || String(val) === "Non-Conformant" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                              {String(val)}
                            </span>
                          ) : (
                            <span className="text-foreground">{String(val)}</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                      No records matched the query filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer preview info */}
          <div className="p-4 border-t border-border/80 flex items-center justify-between text-[10px] font-mono text-muted-foreground bg-muted/5">
            <div>
              Platform: <span className="font-bold text-slate-700 dark:text-slate-300">Aviation Audit Registry</span>
            </div>
            <div>
              Previewing {Math.min(15, activeReportInfo.data.length)} of {activeReportInfo.data.length} records matching filters
            </div>
          </div>
        </div>

      </div>

      {/* Recent Exports Log (Mocked platform export history logs) (Hidden when printing) */}
      <Card className="border border-border/80 rounded-xl shadow-sm overflow-hidden bg-background print:hidden">
        <CardHeader className="bg-muted/10 border-b border-border/80 px-6 py-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> Export History Logs
          </CardTitle>
          <CardDescription className="text-[10px]">
            Audit history of files compiled and exported from this browser workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase px-6">Generated File Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Format</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Compiled Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportLogs.length > 0 ? (
                  exportLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-xs px-6 font-mono">{log.filename}</TableCell>
                      <TableCell className="text-center text-xs font-mono text-muted-foreground">{log.format}</TableCell>
                      <TableCell className="text-center text-xs">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground font-mono">{log.compiledDate}</TableCell>
                      <TableCell className="text-right px-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.location.href = `/api/reports/download-stream?type=${log.type}`}
                          className="h-8 text-xs font-bold hover:bg-primary/10 hover:text-primary gap-1"
                        >
                          <Download className="h-3 w-3" /> Re-Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                      No files exported in this browser session.
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
