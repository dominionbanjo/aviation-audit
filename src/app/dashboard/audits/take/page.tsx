"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save2, Send2, Element3, DocumentText, TaskSquare } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const MOCK_TEMPLATE = {
  name: "Avionics Workshop Checklist",
  categories: [
    {
      id: "c1",
      name: "PERSONNEL",
      questions: [
        { id: "q1", query: "Is the Shop Supervisor qualified as per MPM/MCM requirements?", ref: "MPM 3.4.2.H" },
        { id: "q2", query: "Does the Shop Supervisor have adequate licence / Authorisation?", ref: "MPM 3.4.2.j" },
        { id: "q3", query: "Are the shop supervisor and other departmental staff regularly trained?", ref: "MPM 1.5" },
      ]
    },
    {
      id: "c2",
      name: "MATERIALS",
      questions: [
        { id: "q4", query: "Are spare parts traceable?", ref: "MPM 1.8" },
      ]
    }
  ]
};

type ResponseValue = "SAT" | "UNSAT" | "N/A" | null;

export default function TakeAuditPage() {
  const router = useRouter();
  
  // Setup Phase
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [auditRef] = useState(`AD-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random()*9000)+1000}`);
  
  // Execution Phase Responses (questionId -> { val, comment })
  const [responses, setResponses] = useState<Record<string, { val: ResponseValue, comment: string }>>({});

  const handleResponseChange = (qId: string, val: ResponseValue) => {
    setResponses(prev => ({ ...prev, [qId]: { ...prev[qId], val } }));
  };

  const handleCommentChange = (qId: string, comment: string) => {
    setResponses(prev => ({ ...prev, [qId]: { ...prev[qId], comment } }));
  };

  if (!isSetupComplete) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <div className="space-y-2 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 -ml-3 text-muted-foreground hover:text-foreground mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} variant="Outline" color="currentColor" />
            Back to Audits
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Initialize Audit Session</h1>
          <p className="text-muted-foreground">Select a baseline template to generate the execution checklist.</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audit Template</Label>
                <Select defaultValue="t1">
                  <SelectTrigger className="h-12 bg-muted/20">
                    <SelectValue placeholder="Select template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t1">Avionics Workshop Checklist</SelectItem>
                    <SelectItem value="t2">Line Maintenance Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audit Ref No. (Auto)</Label>
                <Input value={auditRef} disabled className="h-12 font-mono text-primary font-bold bg-primary/5 border-primary/20" />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Auditor (Sign-off)</Label>
                <Input defaultValue="AKINNIRAN A B" className="h-12 bg-muted/20 text-muted-foreground font-semibold" disabled />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Location</Label>
                <Input placeholder="e.g. LAGOS HQ" className="h-12" />
              </div>
            </div>

            <div className="pt-8 border-t border-border flex justify-end">
              <Button onClick={() => setIsSetupComplete(true)} size="lg" className="w-full sm:w-auto h-12 px-8 gap-2 shadow-lg">
                <DocumentText size={20} variant="Bold" color="currentColor" /> Generate Checklist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Audit Flow
  return (
    <div className="space-y-0 relative pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border pb-4 pt-4 mb-8 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-500/10 border border-amber-500/20">Active Session</span>
              <span className="font-mono text-sm font-bold text-primary">{auditRef}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{MOCK_TEMPLATE.name}</h1>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none gap-2">
              <Save2 size={18} variant="Outline" color="currentColor" /> Save Draft
            </Button>
            <Button className="flex-1 md:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <Send2 size={18} variant="Bold" color="currentColor" /> Complete Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Loop */}
      <div className="space-y-12 max-w-5xl mx-auto">
        {MOCK_TEMPLATE.categories.map((cat, catIdx) => (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-border">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                {catIdx + 1}
              </div>
              <h2 className="text-xl font-black tracking-widest text-foreground">{cat.name}</h2>
            </div>
            
            <div className="space-y-4">
              {cat.questions.map((q, qIdx) => {
                const response = responses[q.id]?.val;
                return (
                  <Card key={q.id} className={`shadow-sm overflow-hidden transition-all ${response ? 'border-l-4 border-l-primary' : 'border-border'}`}>
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      {/* Question Details */}
                      <div className="flex-1 p-5 md:p-6 bg-muted/10 md:border-r border-border">
                        <div className="flex items-start gap-4">
                          <span className="text-sm font-bold text-muted-foreground/50 pt-0.5 w-6 shrink-0">{catIdx + 1}.{qIdx + 1}</span>
                          <div className="space-y-3">
                            <p className="text-base font-medium leading-relaxed">{q.query}</p>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/50 border border-border">
                              <DocumentText size={12} className="text-muted-foreground" />
                              <span className="text-[10px] font-mono tracking-widest text-muted-foreground font-bold">REF: {q.ref}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Answer & Comments */}
                      <div className="w-full md:w-[380px] shrink-0 flex flex-col pt-0 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="flex items-center w-full h-14 border-b border-border divide-x divide-border">
                          {["SAT", "UNSAT", "N/A"].map((opt) => {
                            const isSelected = response === opt;
                            const activeClass = opt === "SAT" && isSelected ? "bg-emerald-500/10 text-emerald-600 font-bold" 
                                              : opt === "UNSAT" && isSelected ? "bg-destructive/10 text-destructive font-bold"
                                              : opt === "N/A" && isSelected ? "bg-slate-500/10 text-slate-600 font-bold dark:text-slate-300"
                                              : "text-muted-foreground hover:bg-muted/50";
                            return (
                              <button 
                                key={opt}
                                className={`flex-1 h-full text-xs transition-colors ${activeClass}`}
                                onClick={() => handleResponseChange(q.id, opt as ResponseValue)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        <div className="p-0 flex-1">
                          <textarea 
                            className="w-full h-full min-h-[80px] resize-none bg-transparent border-0 p-4 text-sm placeholder:text-muted-foreground/40 focus:ring-0 focus:outline-none"
                            placeholder="Add your auditor comments here..."
                            value={responses[q.id]?.comment || ""}
                            onChange={(e) => handleCommentChange(q.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
