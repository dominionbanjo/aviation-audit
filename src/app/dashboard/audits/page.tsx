"use client";

import React, { useState } from "react";
import { DocumentText, TickCircle, TaskSquare, AddCircle, PlayCircle, StopCircle, Discover } from "iconsax-react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/shared/Modal";
import { Skeleton } from "@/components/ui/skeleton";

import { AuditRecord } from "@/modules/audits/types";
import { getAuditColumns } from "@/modules/audits/columns";

import { 
  useGetAuditsQuery, 
  useGetAuditStatsQuery,
  useGetAuditQuery
} from "@/redux/api/endpoints/auditEndpoints";

export default function AuditsHistoryPage() {
  const router = useRouter();

  // Selected audit for modal report view
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: auditsData, isLoading } = useGetAuditsQuery({ page, limit, search });
  const { data: statsData, isLoading: statsLoading } = useGetAuditStatsQuery();
  
  // Fetch detailed audit report data (skipped when no audit selected)
  const { data: detailData, isLoading: detailLoading } = useGetAuditQuery(
    selectedAuditId ?? "", 
    { skip: !selectedAuditId }
  );

  const audits = auditsData?.data ?? [];
  const pagination = auditsData?.pagination;
  const stats = statsData?.stats;

  const columns = getAuditColumns({
    onView: (id) => {
      setSelectedAuditId(id);
      setIsDetailsOpen(true);
    },
    onResume: (id) => router.push(`/dashboard/audits/${id}/execute`),
  });

  const auditDetails = detailData?.audit;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Archive</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historical records, in-progress audits, and past compliance reports.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/audits/take")} className="gap-2 h-10 shadow-lg" size="sm">
          <TaskSquare size={18} variant="Bold" color="currentColor" />
          Take Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Audits Done"
          value={stats?.totalAuditsDone?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<TickCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Active / In-progress"
          value={stats?.activeAudits?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<PlayCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
        <StatCard
          title="Audit Locations"
          value={stats?.uniqueLocations?.toLocaleString() || "0"}
          isLoading={statsLoading}
          icon={<DocumentText size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
      </div>

      <div className="pt-4">
        <DataTable 
          columns={columns} 
          data={audits}
          isLoading={isLoading}
          searchKey="refNo" 
          searchPlaceholder="Search by Audit Ref Number..." 
          filterKey="location"
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

      {/* AUDIT DETAILS / REPORT SHOWN IN MODAL */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAuditId(null);
        }}
        title="Audit Compliance Report"
        className="sm:max-w-[700px]"
      >
        {detailLoading && (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        )}

        {!detailLoading && auditDetails && (
          <div className="space-y-6 pt-2">
            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/40 border border-border/60 rounded-xl text-xs">
              <div>
                <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide">Ref Number</span>
                <span className="font-bold text-foreground">{auditDetails.refNo}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide">Location</span>
                <span className="font-bold text-foreground">{auditDetails.location}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide">Auditor Name</span>
                <span className="font-bold text-foreground">{auditDetails.auditorName || "Unknown"}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block uppercase text-[9px] tracking-wide">Date Executed</span>
                <span className="font-bold text-foreground">
                  {new Date(auditDetails.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="border border-border/80 rounded-xl overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/80">
                <span className="font-bold text-sm text-foreground">
                  Template: {auditDetails.template?.name}
                </span>
              </div>

              <div className="divide-y divide-border/50 max-h-[45vh] overflow-y-auto">
                {auditDetails.template?.categories?.map((cat) => {
                  return (
                    <div key={cat.id} className="p-4 space-y-3">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                        {cat.name}
                      </h4>

                      <div className="space-y-2">
                        {cat.questions?.map((q) => {
                          // Find corresponding response
                          const resp = auditDetails.responses?.find(
                            (r) => r.questionId === q.id
                          );
                          
                          let badgeBg = "bg-slate-500/10 text-slate-500 border-slate-500/20";
                          if (resp?.responseValue === "SAT") {
                            badgeBg = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                          } else if (resp?.responseValue === "UNSAT") {
                            badgeBg = "bg-red-500/10 text-red-500 border-red-500/20";
                          } else if (resp?.responseValue === "N/A") {
                            badgeBg = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                          }

                          return (
                            <div key={q.id} className="text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-3 bg-muted/10 border border-border/30 rounded-lg hover:bg-muted/20 transition-all duration-200">
                              <div className="space-y-1 max-w-[80%]">
                                <p className="font-semibold text-foreground leading-relaxed">
                                  {q.query}
                                </p>
                                {q.manualRef && (
                                  <span className="text-[10px] font-mono text-muted-foreground block">
                                    Ref: {q.manualRef}
                                  </span>
                                )}
                                {resp?.comment && (
                                  <p className="text-[11px] italic text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 mt-1 w-fit">
                                    Comment: {resp.comment}
                                  </p>
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold shrink-0 uppercase tracking-widest ${badgeBg}`}>
                                {resp?.responseValue || "UNANSWERED"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailsOpen(false);
                  setSelectedAuditId(null);
                }}
                className="h-10 px-6 font-bold text-xs"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
