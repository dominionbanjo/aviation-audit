"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TemplateForm } from "@/components/audit/TemplateForm";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";

export default function EditAuditTemplatePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/audit/templates/${id}`);
        if (!res.ok) throw new Error("Template not found or unable to load");
        const data = await res.json();
        setTemplate(data.template);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <PageHeader title="Loading Template..." description="Please wait while we retrieve the template data." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-1 h-96 w-full rounded-xl" />
          <Skeleton className="lg:col-span-2 h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="space-y-6 pb-24 text-center py-24">
        <div className="text-destructive font-semibold mb-4">{error || "Failed to load template"}</div>
        <button className="text-sm font-bold text-primary underline" onClick={() => router.push("/dashboard/audit/templates")}>
          Return to Templates
        </button>
      </div>
    );
  }

  return <TemplateForm mode="edit" initialData={template} />;
}
