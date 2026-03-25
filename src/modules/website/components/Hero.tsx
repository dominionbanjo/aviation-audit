"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  AirplaneSquare, 
  ShieldTick, 
  Chart, 
  DocumentText, 
  Radar, 
  Global,
  Notification,
  Cpu,
  Task,
  Activity
} from "iconsax-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Structural Tech Background */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="flex flex-col gap-10 relative z-20"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
               <div className="text-[10px] font-mono text-primary animate-pulse">
                  ● ICAO_ANNEX_19_COMPLIANT
               </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Aviation Quality <br />
              <span className="text-primary italic">& Safety</span> Oversight.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
              Enterprise-grade digitalization for aviation audits. Built for strict compliance 
              with <span className="text-foreground font-bold italic">NCAA Advisory Circulars</span> and 
              International Standards. Replace manual checklists with high-fidelity safety data logic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-lg px-8 h-12 text-sm font-bold shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90">
               ACCESS TERMINAL
               <Cpu size={18} variant="Bulk" color="currentColor" className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg px-8 h-12 text-sm font-bold border-border hover:bg-muted/50">
               VIEW REGULATORY SPECS
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-border">
             {[
               { icon: Radar, label: "Live Tracking", code: "REF_O_44" },
               { icon: ShieldTick, label: "SMS Ready", code: "ICAO_V2" },
               { icon: Task, label: "E-Checklists", code: "NCAA_C" },
               { icon: Activity, label: "Safety KPIs", code: "KPI_LG" }
             ].map((item, i) => (
               <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-primary">
                    <item.icon size={16} variant="Bulk" color="currentColor" />
                    <span className="text-[10px] font-mono opacity-50">{item.code}</span>
                  </div>
                  <span className="text-xs font-bold leading-none">{item.label}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Technical UI Visual */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10"
          >
            {/* Main App Workspace */}
            <div className="bg-muted/40 backdrop-blur-3xl border border-border rounded-xl p-0 shadow-2xl overflow-hidden min-h-[500px]">
               {/* Browser-like Toolbar */}
               <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-border" />
                     <div className="w-2.5 h-2.5 rounded-full bg-border" />
                     <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground tracking-tighter">
                     AQSAMS_WORKPLACE // AUDIT_REF: NCAA_AW_142
                  </div>
               </div>

               <div className="p-6 grid grid-cols-12 gap-6">
                  {/* Sidebar Nav Mock */}
                  <div className="col-span-3 space-y-4">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={cn("h-7 rounded-sm border", i === 1 ? "bg-primary/10 border-primary/20" : "bg-background/20 border-transparent")} />
                     ))}
                  </div>
                  
                  {/* Content Area */}
                  <div className="col-span-9 space-y-6">
                     <div className="bg-background/40 border border-border rounded-lg p-5">
                        <div className="flex items-center justify-between mb-6">
                           <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-mono rounded-sm border border-emerald-500/20">
                              SAT_LEVEL: 0.98
                           </div>
                           <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Operator: AIR_PEACE_NG</div>
                        </div>
                        <div className="space-y-4">
                           {[1, 2].map(i => (
                              <div key={i} className="flex items-center gap-4 bg-muted/30 p-3 rounded-md border border-border/50">
                                 <div className="w-8 h-8 rounded bg-background flex items-center justify-center border border-border text-primary">
                                    <DocumentText size={14} variant="Bulk" color="currentColor" />
                                 </div>
                                 <div className="flex-1 space-y-1.5">
                                    <div className="h-2 w-1/2 bg-muted rounded-full" />
                                    <div className="h-1.5 w-1/4 bg-muted/50 rounded-full" />
                                 </div>
                                 <div className="w-4 h-4 rounded-full border border-border" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 h-32 flex flex-col justify-between">
                           <Chart size={20} variant="Bulk" color="currentColor" className="text-primary" />
                           <div className="text-[10px] font-mono">KPI_SCORE: 112%</div>
                        </div>
                        <div className="bg-background/40 border border-border rounded-lg p-4 h-32" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Overlapping Status Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-64 bg-background border border-border shadow-2xl rounded-lg p-5 z-20"
            >
               <div className="flex items-center justify-between mb-4">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Findings_Manager</div>
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                     <Global size={12} variant="Linear" color="currentColor" />
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-md">
                     <div className="text-[10px] font-bold mb-1">UNSAT: Critical Component</div>
                     <div className="text-[9px] text-muted-foreground">REF: Nig.CAR 20.2.1-A</div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full w-[40%] bg-amber-500 rounded-full" />
                  </div>
               </div>
            </motion.div>
          </motion.div>

          {/* Abstract Engine Contours (Background) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 pointer-events-none -z-5">
             <Radar size={600} variant="Outline" color="currentColor" className="text-primary/20 rotate-45" />
          </div>
        </div>
      </div>
    </section>
  );
};
