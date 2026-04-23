"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AddCircle, Save2, Setting4, RecordCircle, Trash } from "iconsax-react";
import { PageHeader } from "@/components/shared/PageHeader";

// ─── Local types ──────────────────────────────────────────────────────────────
interface QuestionDraft {
  localId: string;
  query: string;
  manualRef: string;
}

interface CategoryDraft {
  localId: string;
  name: string;
  questions: QuestionDraft[];
}

import { 
  useCreateTemplateMutation, 
  useUpdateTemplateMutation 
} from "@/redux/api/endpoints/templateEndpoints";

const makeId = () => crypto.randomUUID();

interface TemplateFormProps {
  mode: "create" | "edit";
  initialData?: any;
}

export function TemplateForm({ mode, initialData }: TemplateFormProps) {
  const router = useRouter();

  // RTK Query Mutations
  const [createTemplate] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();

  // ─── Template meta state ───────────────────────────────────────────────────
  const [name, setName] = useState(initialData?.name || "");
  const [locationType, setLocationType] = useState(initialData?.locationType || "workshop");
  const [regulatoryBase, setRegulatoryBase] = useState(initialData?.regulatoryBase || "ncaa");

  // ─── Categories state ──────────────────────────────────────────────────────
  const [categories, setCategories] = useState<CategoryDraft[]>([]);

  useEffect(() => {
    if (mode === "edit" && initialData?.categories) {
      setCategories(
        initialData.categories.map((c: any) => ({
          localId: makeId(),
          name: c.name,
          questions: c.questions.map((q: any) => ({
            localId: makeId(),
            query: q.query,
            manualRef: q.manualRef || "",
          })),
        }))
      );
    }
  }, [mode, initialData]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─── Category helpers ──────────────────────────────────────────────────────
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { localId: makeId(), name: "NEW CATEGORY", questions: [] },
    ]);
  };

  const updateCategoryName = (localId: string, value: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.localId === localId ? { ...c, name: value } : c))
    );
  };

  const deleteCategory = (localId: string) => {
    setCategories((prev) => prev.filter((c) => c.localId !== localId));
  };

  // ─── Question helpers ──────────────────────────────────────────────────────
  const addQuestion = (catLocalId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.localId === catLocalId
          ? { ...c, questions: [...c.questions, { localId: makeId(), query: "", manualRef: "" }] }
          : c
      )
    );
  };

  const updateQuestion = (catLocalId: string, qLocalId: string, field: "query" | "manualRef", value: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.localId === catLocalId
          ? {
              ...c,
              questions: c.questions.map((q) =>
                q.localId === qLocalId ? { ...q, [field]: value } : q
              ),
            }
          : c
      )
    );
  };

  const deleteQuestion = (catLocalId: string, qLocalId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.localId === catLocalId
          ? { ...c, questions: c.questions.filter((q) => q.localId !== qLocalId) }
          : c
      )
    );
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError("Please enter a template name.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const data = {
        name: name.trim(),
        locationType,
        regulatoryBase,
        categories: categories.map((cat, ci) => ({
          name: cat.name,
          orderIndex: ci,
          questions: cat.questions.map((q, qi) => ({
            query: q.query,
            manualRef: q.manualRef || undefined,
            orderIndex: qi,
          })),
        })),
      };

      if (mode === "edit") {
        await updateTemplate({ id: initialData.id, data }).unwrap();
      } else {
        await createTemplate(data).unwrap();
      }

      router.push("/dashboard/audit/templates");
    } catch (err: any) {
      setSaveError(err.data?.error || err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title={mode === "edit" ? "Edit Template" : "Template Builder"}
        description={mode === "edit" ? "Modify existing template checklist and properties." : "Construct standard checklists for specific audit locations or departments."}
        backLabel="Back to Templates"
        backHref="/dashboard/audit/templates"
        action={
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg h-10 w-full sm:w-auto">
            <Save2 size={18} variant="Bold" color="currentColor" />
            {isSaving ? "Saving…" : (mode === "edit" ? "Update Template" : "Save Template")}
          </Button>
        }
      />

      {saveError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Template Properties Sidebar ───────────────────────────────── */}
        <Card className="lg:col-span-1 shadow-sm h-fit sticky top-24">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-md flex items-center gap-2">
              <Setting4 size={20} variant="Bold" color="currentColor" className="text-primary" />
              Template Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Template Name *
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AVIONICS WORKSHOP"
                className="font-semibold"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Location Type
              </Label>
              <Select value={locationType} onValueChange={setLocationType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Maintenance Workshop</SelectItem>
                  <SelectItem value="line">Line Station</SelectItem>
                  <SelectItem value="office">Office Facility</SelectItem>
                  <SelectItem value="ramp">Ramp / Apron</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Regulatory Base
              </Label>
              <Select value={regulatoryBase} onValueChange={setRegulatoryBase}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ncaa">Nig. CARs / MPM / MCM</SelectItem>
                  <SelectItem value="iata">IATA IOSA</SelectItem>
                  <SelectItem value="icao">ICAO Annex 19</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 border-t mt-6">
              <Button
                onClick={addCategory}
                variant="outline"
                className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 border-dashed bg-background"
              >
                <AddCircle size={20} variant="Outline" color="currentColor" />
                Add Category Group
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Categories + Questions Builder ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border h-60 text-muted-foreground text-sm gap-3">
              <AddCircle size={32} variant="Outline" color="currentColor" className="opacity-40" />
              <p>No categories yet. Click <strong className="text-foreground">"Add Category Group"</strong> to start.</p>
            </div>
          ) : (
            categories.map((cat, ci) => (
              <Card key={cat.localId} className="shadow-sm overflow-hidden border-border hover:border-primary/20 transition-all">
                <CardHeader className="bg-muted/50 border-b py-3 px-5 flex flex-row items-center justify-between">
                  <Input
                    value={cat.name}
                    onChange={(e) => updateCategoryName(cat.localId, e.target.value.toUpperCase())}
                    className="h-8 max-w-[220px] font-bold tracking-wider uppercase text-foreground bg-transparent border-transparent hover:bg-background hover:border-input focus-visible:bg-background"
                  />
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => deleteCategory(cat.localId)}
                  >
                    <Trash size={16} variant="Outline" color="currentColor" />
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {cat.questions.map((q, qi) => (
                      <div key={q.localId} className="p-4 sm:p-5 flex gap-3 hover:bg-muted/30 transition-colors group relative">
                        <span className="font-semibold text-muted-foreground/50 w-6 pt-2.5 shrink-0 text-sm">
                          {qi + 1}.
                        </span>
                        <div className="flex-1 space-y-3">
                          <Input
                            value={q.query}
                            onChange={(e) => updateQuestion(cat.localId, q.localId, "query", e.target.value)}
                            placeholder="Enter question text..."
                            className="font-medium bg-transparent border-transparent group-hover:border-input group-hover:bg-background focus-visible:bg-background"
                          />
                          <div className="flex gap-3 items-center">
                            <Label className="text-[10px] text-muted-foreground uppercase tracking-widest shrink-0 font-bold">
                              Manual Ref:
                            </Label>
                            <Input
                              value={q.manualRef}
                              onChange={(e) => updateQuestion(cat.localId, q.localId, "manualRef", e.target.value)}
                              placeholder="e.g. MPM 1.8"
                              className="h-8 text-xs font-mono bg-transparent border-transparent group-hover:border-input group-hover:bg-background focus-visible:bg-background w-32"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                          onClick={() => deleteQuestion(cat.localId, q.localId)}
                        >
                          <Trash size={14} variant="Outline" color="currentColor" />
                        </Button>
                      </div>
                    ))}

                    <div className="p-3 bg-muted/20">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => addQuestion(cat.localId)}
                        className="text-primary gap-2 w-full justify-start hover:bg-primary/5 hover:text-primary"
                      >
                        <RecordCircle size={18} variant="Outline" color="currentColor" />
                        Add Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
