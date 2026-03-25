"use client";

import React from "react";
import { motion } from "framer-motion";
import { TaskSquare, Edit, ClipboardTick, Warning2, ShieldSearch, DocumentCode } from "iconsax-react";
import { cn } from "@/lib/utils";

export const Audit = () => {
  return (
    <section id="audit" className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-5/12">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-px w-8 bg-primary" />
                   <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Technical_Audit_Core</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                   High-Fidelity <br />
                   Audit Intelligence.
                </h2>
                
                <div className="space-y-10">
                  {[
                    {
                      icon: ShieldSearch,
                      title: "Regulatory Compliance Engine",
                      desc: "Integrated mapping for ICAO Annex 19, Nig. CAR Part 20, and IATA safety standards."
                    },
                    {
                      icon: TaskSquare,
                      title: "Standardized E-Checklists",
                      desc: "Deploy predefined templates for MEL/MMEL verification, Avionics Workshops, and SMS Audits."
                    },
                    {
                      icon: DocumentCode,
                      title: "Smart Inspection Logic",
                      desc: "Automated logic for SAT/UNSAT/NA results with mandatory evidence upload and timestamping."
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="shrink-0 w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center border border-primary/10">
                         <feature.icon size={24} variant="Bulk" color="currentColor" className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1.5">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </motion.div>
          </div>

          <div className="lg:w-7/12 relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="bg-muted p-1 overflow-hidden border border-border rounded-xl"
             >
                {/* Technical Audit Workspace */}
                <div className="bg-card rounded-lg p-6 shadow-2xl border border-border">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                            <ClipboardTick size={24} variant="Bulk" color="currentColor" />
                         </div>
                         <div>
                            <h5 className="font-bold text-sm tracking-tight">AUDIT_REF: NCAA/AW/2026/042</h5>
                            <p className="text-[10px] text-muted-foreground font-mono">AVIONICS_WORKSHOP_INSPECTION_V1.2</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 font-mono">Status</div>
                         <div className="text-[10px] font-bold text-emerald-500 font-mono">LIVE_COLLECTION</div>
                      </div>
                   </div>

                   <div className="space-y-4">
                     {/* Technical Progress */}
                     <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <div className="flex justify-between items-end mb-3">
                           <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase">Compliance Score</div>
                              <div className="text-xl font-mono font-bold leading-none">85.4%</div>
                           </div>
                           <div className="text-[10px] font-bold text-muted-foreground">TASKS: 42/50</div>
                        </div>
                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: "85.4%" }}
                             viewport={{ once: true }}
                             transition={{ duration: 1.5 }}
                             className="bg-primary h-full" 
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        {[
                          { id: "SEC_4.1.2", label: "C of A Validity Verification", status: "SAT", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                          { id: "SEC_4.1.5", label: "Critical Component Storage (Temp/Humidity)", status: "UNSAT", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
                          { id: "SEC_4.2.1", label: "Personnel Licence Endorsement Check", status: "PND", color: "text-muted-foreground", bg: "bg-muted-foreground/10", border: "border-border" },
                        ].map((item, i) => (
                          <div key={i} className={cn("p-4 rounded-lg border flex items-center justify-between transition-colors", item.border, i === 0 ? "bg-background shadow-sm" : "bg-muted/10")}>
                             <div className="flex items-center gap-4">
                                <span className="text-[9px] font-mono text-muted-foreground shrink-0">{item.id}</span>
                                <span className="text-xs font-bold">{item.label}</span>
                             </div>
                             <div className={cn("px-2.5 py-1 rounded text-[9px] font-mono font-bold border", item.bg, item.color, item.border)}>
                                {item.status}
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex gap-10">
                         <div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">Findings</div>
                            <div className="text-lg font-mono font-bold">12</div>
                         </div>
                         <div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase">Closed</div>
                            <div className="text-lg font-mono font-bold text-emerald-500">07</div>
                         </div>
                      </div>
                      <button className="text-[10px] font-bold bg-primary px-4 py-2 rounded text-white shadow-lg">
                         EXECUTE_CLOSURE
                      </button>
                   </div>
                </div>
             </motion.div>

             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-12 -right-4 lg:-right-8 px-6 py-4 bg-background border border-border rounded-lg shadow-2xl z-20 flex gap-4 items-center"
             >
                <div className="w-10 h-10 bg-amber-500/10 rounded-sm flex items-center justify-center border border-amber-500/20">
                   <Warning2 size={20} variant="Bulk" color="currentColor" className="text-amber-500" />
                </div>
                <div>
                   <div className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider">ALERT: Level_1_Finding</div>
                   <div className="text-xs font-bold">Uncertified Part Detected</div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
