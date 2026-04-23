"use client";

import React from "react";
import { motion } from "framer-motion";
import { Timer1, ChartSuccess, Activity, Flash, TrendUp, Radar } from "iconsax-react";
import { cn } from "@/lib/utils";

export const OTP = () => {
  return (
    <section id="otp" className="py-24 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
          <div className="lg:w-5/12">
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-px w-8 bg-primary" />
                   <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Operations_Control_Metrics</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                   Turnaround & <br />
                   OTP Precision.
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed mb-10 font-medium">
                  AQSAMS Operational Core synchronizes safety data with flight schedules. 
                  Bridge the gap between safety compliance and On-Time Performance (OTP) 
                  using integrated IATA delay code tracking and turnaround analytics.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: Timer1,
                      title: "IATA Delay Mapping",
                      desc: "Automated attribution of delay codes (81-Technical, 93-Ramp) to safety events."
                    },
                    {
                      icon: ChartSuccess,
                      title: "Standard Performance",
                      desc: "KPI benchmarking against ICAO Document 9859 and industry-leading safety targets."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-lg">
                       <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                          <item.icon size={20} variant="Bold" color="currentColor" className="text-primary" />
                       </div>
                       <div>
                          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </motion.div>
          </div>

          <div className="lg:w-7/12 relative flex items-center justify-center">
             {/* Operations Console Visual */}
             <div className="relative w-full bg-[#0a0c10] border border-white/10 rounded-xl p-8 shadow-2xl overflow-hidden min-h-[450px]">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                   <div className="flex flex-col">
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">OPS_TERMINAL // DNA_SYNC</div>
                      <div className="text-xs font-bold font-mono">STATION: LOS // DATA_FEED: ACTIVE</div>
                   </div>
                   <div className="flex gap-4">
                      <div className="text-right">
                         <div className="text-[9px] font-mono text-slate-500">AVG_OTP</div>
                         <div className="text-sm font-bold text-emerald-500 font-mono">94.2%</div>
                      </div>
                      <div className="text-right border-l border-white/10 pl-4">
                         <div className="text-[9px] font-mono text-slate-500">TRT_AVG</div>
                         <div className="text-sm font-bold text-primary font-mono">38.4m</div>
                      </div>
                   </div>
                </div>
                
                <div className="space-y-6">
                   {/* Delayed Flight List Mock */}
                   {[
                     { flight: "APK142", target: "10:15", actual: "10:28", code: "81_TECH", delay: "13m", color: "text-amber-500" },
                     { flight: "APK092", target: "11:45", actual: "11:45", code: "--_OK", delay: "0m", color: "text-emerald-500" },
                     { flight: "APK221", target: "12:10", actual: "12:45", code: "93_RAMP", delay: "35m", color: "text-rose-500" }
                   ].map((f, i) => (
                     <div key={i} className="flex items-center justify-between text-[10px] font-mono bg-white/5 p-3 rounded border border-white/5">
                        <div className="flex gap-8">
                           <span className="font-bold tracking-widest">{f.flight}</span>
                           <span className="text-slate-500">SCH: {f.target}</span>
                           <span className={cn("hidden sm:inline", f.color)}>ACT: {f.actual}</span>
                        </div>
                        <div className="flex gap-6 items-center">
                           <span className="opacity-40">{f.code}</span>
                           <span className={f.color}>+{f.delay}</span>
                        </div>
                     </div>
                   ))}

                   {/* Activity Graph */}
                   <div className="mt-10 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[8px] font-mono text-slate-500 uppercase">Load_Factor_Analytics</span>
                         <span className="text-[10px] text-primary font-mono">FEED_60hz</span>
                      </div>
                      <div className="flex items-end gap-1 h-20 opacity-30">
                         {[...Array(30)].map((_, i) => (
                           <div 
                              key={i} 
                              className="flex-1 bg-primary rounded-t-[1px]" 
                              style={{ height: `${Math.random() * 100}%` }} 
                           />
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             {/* Background Radar Anim */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none"
             >
                <Radar size={600} variant="Outline" color="currentColor" className="text-primary" />
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
