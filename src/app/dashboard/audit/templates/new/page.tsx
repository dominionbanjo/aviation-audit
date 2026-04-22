"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCircle, Save2, Setting4, RecordCircle, ArrowLeft, Trash } from "iconsax-react";
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

export default function NewAuditTemplatePage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "PERSONNEL",
      questions: [
        {
          id: 1,
          q: "Is the Shop Supervisor qualified as per MPM/MCM requirements?",
          ref: "MPM 3.4.2.H",
        },
      ],
    },
    {
      id: 2,
      name: "MATERIALS",
      questions: [{ id: 2, q: "Are spare parts traceable?", ref: "MPM 1.8" }],
    },
  ]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 -ml-3 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} variant="Outline" color="currentColor" />
            Back to Templates
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Template Builder
          </h1>
          <p className="text-muted-foreground text-sm">
            Construct standard checklists for specific audit locations or departments.
          </p>
        </div>
        <Button className="gap-2 shadow-lg h-10 w-full sm:w-auto mt-4 sm:mt-0">
          <Save2 size={18} variant="Bold" color="currentColor" /> Save Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Meta */}
        <Card className="lg:col-span-1 shadow-sm h-fit sticky top-24">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-md flex items-center gap-2">
              <Setting4 size={20} variant="Bulk" className="text-primary" />
              Template Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Template Name</Label>
              <Input defaultValue="AVIONICS WORKSHOP" className="font-semibold" />
            </div>
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location Type</Label>
              <Select defaultValue="workshop">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Maintenance Workshop</SelectItem>
                  <SelectItem value="line">Line Station</SelectItem>
                  <SelectItem value="office">Office Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Regulatory Base</Label>
              <Select defaultValue="ncaa">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ncaa">Nig. CARs / MPM / MCM</SelectItem>
                  <SelectItem value="iata">IATA IOSA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-6 border-t mt-6">
              <Button
                variant="outline"
                className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 border-dashed bg-background"
              >
                <AddCircle size={20} variant="Outline" color="currentColor" />
                Add Category Group
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Builder */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map((cat, i) => (
            <Card key={cat.id} className="shadow-sm overflow-hidden border-border transition-all hover:border-primary/20">
              <CardHeader className="bg-muted/50 border-b py-3 px-5 flex flex-row items-center justify-between">
                <Input 
                   defaultValue={cat.name} 
                   className="h-8 max-w-[200px] font-bold tracking-wider uppercase text-foreground bg-transparent border-transparent hover:bg-background hover:border-input focus-visible:bg-background"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash size={16} variant="Outline" color="currentColor" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {cat.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 flex gap-4 hover:bg-muted/30 transition-colors group relative"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <span className="font-semibold text-muted-foreground/50 w-6 pt-2 shrink-0">
                            {idx + 1}.
                          </span>
                          <Input
                            defaultValue={q.q}
                            placeholder="Enter question text..."
                            className="font-medium bg-transparent border-transparent group-hover:border-input group-hover:bg-background focus-visible:bg-background w-full"
                          />
                        </div>
                        <div className="flex gap-3 items-center ml-9">
                          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest shrink-0 font-bold">
                            Manual Ref:
                          </Label>
                          <Input
                            defaultValue={q.ref}
                            placeholder="e.g. MPM 1.8"
                            className="h-8 text-xs font-mono bg-transparent border-transparent group-hover:border-input group-hover:bg-background focus-visible:bg-background w-32"
                          />
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-5"
                      >
                         <Trash size={14} variant="Outline" color="currentColor" />
                      </Button>
                    </div>
                  ))}
                  <div className="p-3 bg-muted/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary gap-2 w-full justify-start hover:bg-primary/5 hover:text-primary"
                    >
                      <RecordCircle
                        size={18}
                        variant="Outline"
                        color="currentColor"
                      />{" "}
                      Add Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
