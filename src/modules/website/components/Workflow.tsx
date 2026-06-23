"use client";

import { motion } from "framer-motion";
import { 
  Setting, 
  TaskSquare, 
  SearchStatus, 
  ShieldSecurity, 
  CardReceive, 
  Radar 
} from "iconsax-react";

const STEPS = [
  {
    num: "01",
    title: "Template Authoring",
    desc: "Safety managers construct digital checklists mapped directly to Nig. CARs and ICAO annex rules.",
    icon: Setting,
    color: "#3b82f6"
  },
  {
    num: "02",
    title: "Orchestration & Audit",
    desc: "Audits are triggered across airline stations. Onsite auditors input compliance states and notes.",
    icon: TaskSquare,
    color: "#10b981"
  },
  {
    num: "03",
    title: "Findings Triaging",
    desc: "Deficiencies are auto-flagged and classified by severity (Level 1, 2, or 3) with dynamic tracking.",
    icon: SearchStatus,
    color: "#f59e0b"
  },
  {
    num: "04",
    title: "CAP Submission",
    desc: "Airline operators input Corrective Action Plans (CAP) and upload verification evidence logs.",
    icon: CardReceive,
    color: "#8b5cf6"
  },
  {
    num: "05",
    title: "Review & Closure",
    desc: "Lead auditors inspect CAP evidence and officially close the finding, generating compliant safety records.",
    icon: ShieldSecurity,
    color: "#ec4899"
  }
];

export const Workflow = () => {
  return (
    <section className="py-24 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <Radar size={16} variant="Bold" color="#3b82f6" className="animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Operational_Lifecycle</span>
          </div>
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            The Audit & Compliance Engine.
          </h3>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            From design to resolution, AQSAMS provides a unified administrative workspace for safety compliance. Our structural workflow guarantees complete traceability at every checkpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl relative flex flex-col justify-between h-72"
            >
              <div className="space-y-4">
                {/* Step Icon and Number */}
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                    <step.icon size={20} variant="Outline" color={step.color} />
                  </div>
                  <span className="text-2xl font-black font-mono opacity-20 text-slate-300 select-none">
                    {step.num}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Connecting line descriptor */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] w-8 border-t border-dashed border-slate-800 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
