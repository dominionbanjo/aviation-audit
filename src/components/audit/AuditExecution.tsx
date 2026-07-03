"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  useGetAuditQuery, 
  useSaveResponseMutation, 
  useCompleteAuditMutation 
} from "@/redux/api/endpoints/auditEndpoints";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TickCircle, 
  CloseCircle, 
  Forbidden2, 
  ArrowLeft, 
  ArrowRight,
  Hierarchy,
  TickSquare,
  MessageText
} from "iconsax-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuditExecutionProps {
  auditId: string;
}

type ResponseValue = "SAT" | "UNSAT" | "N/A";

export function AuditExecution({ auditId }: AuditExecutionProps) {
  const router = useRouter();
  const { data, isLoading, error } = useGetAuditQuery(auditId);
  const [saveResponse, { isLoading: isSaving }] = useSaveResponseMutation();
  const [completeAudit, { isLoading: isCompleting }] = useCompleteAuditMutation();

  const audit = data?.audit;
  const template = audit?.template;
  const questions = template?.categories.flatMap(c => c.questions) ?? [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  // Separate local state to track uncommitted changes — seeded from DB responses
  const [localResponses, setLocalResponses] = useState<Record<string, { value: ResponseValue | null, comment: string }>>({});

  if (isLoading) return <ExecutionLoader />;
  if (error || !audit) return <div>Error loading audit.</div>;

  const currentQuestion = questions[currentIndex];
  const currentLocal = localResponses[currentQuestion.id] || { value: null, comment: "" };
  
  const totalQuestions = questions.length;
  // Calculate answered count based on local state + committed data
  const answeredCount = questions.filter(q => localResponses[q.id]?.value !== null).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleSelectResponse = (value: ResponseValue) => {
    setLocalResponses(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], value }
    }));
  };

  const handleNext = async () => {
    const current = localResponses[currentQuestion.id];
    
    // Validation
    if (!current?.value) {
      toast.error("Please select a status (SAT/UNSAT/NA) before proceeding");
      return;
    }

    try {
      // Logic: Only submit on Next
      await saveResponse({
        id: auditId,
        questionId: currentQuestion.id,
        responseValue: current.value,
        comment: current.comment || undefined
      }).unwrap();

      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } catch {
      toast.error("Failed to save progress");
    }
  };

  const handleFinish = async () => {
    // Save last question if needed
    const current = localResponses[currentQuestion.id];
    if (current?.value) {
      await saveResponse({
        id: auditId,
        questionId: currentQuestion.id,
        responseValue: current.value,
        comment: current.comment || undefined
      }).unwrap();
    }

    if (answeredCount < totalQuestions) {
      if (!confirm("Some questions are still unanswered. Complete audit anyway?")) return;
    }
    
    try {
      await completeAudit(auditId).unwrap();
      toast.success("Audit completed successfully!");
      router.push("/dashboard/audits");
    } catch {
      toast.error("Failed to complete audit");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2 border-b border-border/40">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {audit.refNo}
            </span>
            <h2 className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">
              {template?.name}
            </h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {answeredCount}/{totalQuestions} Answered
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Question Slider / Wizard */}
      <Card className="border-border/50 shadow-lg overflow-hidden flex flex-col min-h-[450px]">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-start gap-4">
             <div className="space-y-1">
               <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                 <Hierarchy size={12} />
                 {template?.categories.find(c => c.questions.some(q => q.id === currentQuestion.id))?.name}
               </div>
               <CardTitle className="text-xl md:text-2xl leading-tight">
                 {currentQuestion.query}
               </CardTitle>
             </div>
             <span className="text-3xl font-black text-muted-foreground/10 shrink-0 select-none">
               {(currentIndex + 1).toString().padStart(2, "0")}
             </span>
          </div>
          {currentQuestion.manualRef && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <span className="font-semibold text-primary/80">Ref:</span> {currentQuestion.manualRef}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-8 flex-1 space-y-8">
          {/* Action Buttons Optimized for Mobile */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <ResponseButton 
              label="SAT" 
              active={currentLocal?.value === "SAT"} 
              onClick={() => handleSelectResponse("SAT")}
              icon={<TickCircle size={28} variant={currentLocal?.value === "SAT" ? "Bold" : "Outline"} />}
              colorClass="hover:text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500"
            />
            <ResponseButton 
              label="UNSAT" 
              active={currentLocal?.value === "UNSAT"} 
              onClick={() => handleSelectResponse("UNSAT")}
              icon={<CloseCircle size={28} variant={currentLocal?.value === "UNSAT" ? "Bold" : "Outline"} />}
              colorClass="hover:text-rose-500 hover:bg-rose-500/10 border-rose-500/20 data-[active=true]:bg-rose-500 data-[active=true]:text-white data-[active=true]:border-rose-500"
            />
            <ResponseButton 
              label="N/A" 
              active={currentLocal?.value === "N/A"} 
              onClick={() => handleSelectResponse("N/A")}
              icon={<Forbidden2 size={28} variant={currentLocal?.value === "N/A" ? "Bold" : "Outline"} />}
              colorClass="hover:text-slate-500 hover:bg-slate-500/10 border-slate-500/20 data-[active=true]:bg-slate-500 data-[active=true]:text-white data-[active=true]:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <MessageText size={14} /> Auditor Comments (Optional)
            </div>
            <Textarea 
              placeholder="Provide evidence or reasons for non-compliance..." 
              className="resize-none min-h-[100px] border-border/60 bg-muted/20"
              value={currentLocal?.comment || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                 const comment = e.target.value;
                 setLocalResponses(prev => ({
                    ...prev,
                    [currentQuestion.id]: { ...prev[currentQuestion.id], comment }
                 }))
              }}
            />
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t flex justify-between p-4">
          <Button 
            variant="ghost" 
            className="h-12 gap-2" 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={18} /> Previous
          </Button>
          
          {currentIndex === totalQuestions - 1 ? (
            <Button 
              className="h-12 gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" 
              onClick={handleFinish}
              isLoading={isSaving || isCompleting}
            >
              <TickSquare size={18} variant="Bold" /> Finish Audit
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="h-12 gap-2 border-primary/20 text-primary hover:bg-primary/5" 
              onClick={handleNext}
              isLoading={isSaving}
            >
              Next <ArrowRight size={18} />
            </Button>
          )}
        </CardFooter>
      </Card>

      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
        Audit ID: {auditId} • Station: {audit.location}
      </p>
    </div>
  );
}

function ResponseButton({ label, active, onClick, icon, colorClass }: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      data-active={active}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-xl border transition-all active:scale-95",
        colorClass
      )}
    >
      {icon}
      <span className="text-sm font-bold tracking-widest">{label}</span>
    </button>
  );
}

function ExecutionLoader() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4">
      <Skeleton className="h-6 w-1/3 mb-2" />
      <Skeleton className="h-2 w-full mb-8" />
      <Card className="border-border/50 shadow-lg min-h-[450px]">
        <CardHeader className="bg-muted/30 pb-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-12 w-full" />
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
