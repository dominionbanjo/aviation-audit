"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTemplatesQuery } from "@/redux/api/endpoints/templateEndpoints";
import { useStartAuditMutation } from "@/redux/api/endpoints/auditEndpoints";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskSquare, Location, DirectNotification } from "iconsax-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function TakeAuditSetupPage() {
  const router = useRouter();
  
  const { data: templatesData, isLoading: loadingTemplates } = useGetTemplatesQuery();
  const [startAudit, { isLoading: isStarting }] = useStartAuditMutation();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleStart = async () => {
    if (!selectedTemplate || !location.trim()) {
      toast.error("Please select a template and enter a location");
      return;
    }

    try {
      const { auditId } = await startAudit({
        templateId: selectedTemplate,
        location: location.trim(),
      }).unwrap();

      toast.success("Audit session initialized");
      router.push(`/dashboard/audits/${auditId}/execute`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.error || "Failed to initialize audit session");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader
        title="Initialize Audit"
        description="Select a regulatory template and specify the audit location to begin."
      />

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DirectNotification size={20} className="text-primary" variant="Bulk" />
            Audit Parameters
          </CardTitle>
          <CardDescription>
            These details will generate your unique Audit Reference Number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Standard Compliance Template</Label>
            {loadingTemplates ? (
              <Skeleton className="h-12 w-full rounded-md" />
            ) : (
              <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templatesData?.data.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{t.regulatoryBase} • {t.locationType}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Audit Location / Station</Label>
            <div className="relative">
              <Location size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
              <Input 
                placeholder="e.g. LAGOS MRO, ABUJA STATION" 
                className="pl-10 h-12"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          className="flex-1 h-12" 
          onClick={() => router.back()}
          disabled={isStarting}
        >
          Cancel
        </Button>
        <Button 
          className="flex-[2] h-12 gap-2 shadow-lg shadow-primary/20" 
          onClick={handleStart}
          disabled={isStarting || !selectedTemplate || !location.trim()}
        >
          <TaskSquare size={20} variant="Bold" />
          {isStarting ? "Initializing..." : "Begin Audit Execution"}
        </Button>
      </div>
    </div>
  );
}
