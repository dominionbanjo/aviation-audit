"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldTick, Global, Note, StatusUp, DocumentCloud, HierarchySquare, Radar, Activity } from "iconsax-react";

const FEATURES = [
  {
    title: "NCAA Compliance",
    desc: "Pre-integrated database for ICAO Annexes and Nig. CARs Advisory Circulars for safety oversight.",
    icon: ShieldTick,
    id: "COMP_1",
  },
  {
    title: "Organization DNA",
    desc: "From AOC Management to Flight Operations—our hierarchy scales with your airline and AMO structure.",
    icon: HierarchySquare,
    id: "DNA_2",
  },
  {
    title: "Predictive Safety",
    desc: "Advanced SMS dashboards that identify risk trends before they become non-conformities.",
    icon: StatusUp,
    id: "SMS_3",
  },
  {
    title: "Global Standards",
    desc: "Full support for IATA Safety Audit for Ground Operations (ISAGO) and IOSA requirements.",
    icon: Global,
    id: "ISO_4",
  },
  {
    title: "Aviation Repo",
    desc: "Cloud storage for critical manuals (MPM, MCM, SMS, QAM) with automated revision tracking.",
    icon: DocumentCloud,
    id: "REPO_5",
  },
  {
    title: "Regulatory Reporting",
    desc: "Generate NCAA-compliant reports and safety performance indicators with one-click data logic.",
    icon: Note,
    id: "REP_6",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Structural Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
               <Radar size={16} variant="Linear" color="currentColor" className="text-primary animate-pulse" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">System_Capabilities</span>
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">Enterprise Safety Oversight.</h3>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              AQSAMS is an purpose-built ecosystem for the aviation industry. 
              We replace outdated safety oversight models with a seamless, 
              data-driven platform for commercial airline operators, AMOs, 
              and regulatory authorities.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border p-8 rounded-xl hover:border-primary/20 transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   <feature.icon size={24} variant="Bulk" color="currentColor" className="text-primary" />
                 </div>
                 <span className="text-[9px] font-mono text-muted-foreground opacity-50">{feature.id}</span>
              </div>
              <h4 className="text-lg font-bold mb-3">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 pt-10 border-t border-border flex items-center justify-between"
        >
           <div className="flex gap-16">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-50 mb-1">Latency_Check</div>
                <div className="text-xs font-bold text-emerald-500 font-mono">24ms_SYNCED</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-50 mb-1">Redundancy</div>
                <div className="text-xs font-bold text-primary font-mono">3X_SECURE_STORAGE</div>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Activity size={14} variant="Linear" color="currentColor" className="text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core_Operational_Layer</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
};
