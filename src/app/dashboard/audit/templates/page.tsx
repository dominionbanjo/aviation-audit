"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { AddCircle, DocumentText, Setting4, SearchNormal1, Edit2, Eye, Trash } from "iconsax-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateViewModal } from "@/components/audit/TemplateViewModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner"; // Using toast directly if registered, otherwise console.log as fallback

import { 
  useGetTemplatesQuery, 
  useGetStatsQuery, 
  useDeleteTemplateMutation 
} from "@/redux/api/endpoints/templateEndpoints";
import { TemplateWithMeta } from "@/lib/services/audit-template.service";
import { getTemplateColumns } from "@/modules/audit-templates/columns";

export default function AuditTemplatesPage() {
  const router = useRouter();
  
  // RTK Query Hooks
  const { data: templatesData, isLoading: loading, error: templatesError } = useGetTemplatesQuery();
  const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();

  const templates = templatesData?.templates ?? [];
  const stats = statsData?.stats;
  const error = templatesError ? "Failed to load templates" : null;

  // Modal states
  const [viewTemplateId, setViewTemplateId] = useState<string | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTemplateId) return;
    try {
      await deleteTemplate(deleteTemplateId).unwrap();
      setDeleteTemplateId(null);
      toast.success("Template deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.data?.error || "Failed to delete");
    }
  };

  const columns = getTemplateColumns({
    onView: (id) => setViewTemplateId(id),
    onEdit: (id) => router.push(`/dashboard/audit/templates/${id}/edit`),
    onDelete: (id) => setDeleteTemplateId(id),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit Templates"
        description="Manage standardized regulatory checklists and forms used across audits."
        action={
          <Button onClick={() => router.push("/dashboard/audit/templates/new")} className="gap-2 h-10 shadow-lg w-full sm:w-auto">
            <AddCircle size={18} variant="Bold" color="currentColor" />
            Create Template
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Templates"
          value={stats?.totalTemplates ?? 0}
          isLoading={statsLoading}
          icon={<DocumentText size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
        <StatCard
          title="Total Questions"
          value={stats?.totalQuestions ?? 0}
          isLoading={statsLoading}
          icon={<SearchNormal1 size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Avg. Questions/Template"
          value={stats?.averageQuestionsPerTemplate ?? 0}
          isLoading={statsLoading}
          icon={<Setting4 size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          iconColorClass="text-amber-500"
        />
      </div>

      {/* Table */}
      <div className="pt-2 flex-grow">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive text-sm bg-destructive/5 rounded-xl border border-destructive/20">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={templates}
            searchKey="name"
            searchPlaceholder="Search templates by name..."
            filterKey="locationType"
          />
        )}
      </div>

      <TemplateViewModal 
        isOpen={!!viewTemplateId} 
        onClose={() => setViewTemplateId(null)} 
        templateId={viewTemplateId} 
      />

      <ConfirmDialog
        isOpen={!!deleteTemplateId}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={handleDelete}
        title="Delete Audit Template"
        description="Are you sure you want to permanently delete this template? This will remove all category groups and questions. Any historical audits linked to this template will be preserved as snapshotted records."
        confirmText="Delete Template"
        isLoading={isDeleting}
      />
    </div>
  );
}
