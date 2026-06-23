"use client";

import { motion } from "framer-motion";
import { ShieldTick, Radar, StatusUp, Teacher, Cpu } from "iconsax-react";

const PILLARS = [
  {
    num: "01",
    title: "Safety Policy & Objectives",
    desc: "Establish clear management commitment, safety accountabilities, and organizational structures. AQSAMS digitizes safety policy distribution, tracks key safety personnel appointments, and archives compliance manuals with automated revision logs.",
    icon: ShieldTick,
    color: "#3b82f6",
    details: ["Management Commitment", "Safety Accountabilities", "Key Safety Personnel", "SMS Documentation"]
  },
  {
    num: "02",
    title: "Safety Risk Management",
    desc: "Proactive hazard identification and risk assessment. The system includes integrated reporting forms for flight crews and ground handling personnel to log anomalies, which are triaged and mapped to mitigation matrices.",
    icon: Radar,
    color: "#10b981",
    details: ["Hazard Identification", "Risk Assessment", "Mitigation Tracking", "Emergency Response"]
  },
  {
    num: "03",
    title: "Safety Assurance",
    desc: "Continuous monitoring of safety performance. AQSAMS aggregates operational data to track Safety Performance Indicators (SPIs) and targets (SPTs), providing real-time alerts when threshold values deviate from standard safety bounds.",
    icon: StatusUp,
    color: "#f59e0b",
    details: ["Performance Monitoring", "Management of Change", "Continuous Improvement", "Audit Feedbacks"]
  },
  {
    num: "04",
    title: "Safety Promotion",
    desc: "Ensuring all personnel are trained and safety information is communicated. Our terminal includes a safety communication board and tracks training completion for crew members, flight dispatchers, and engineers.",
    icon: Teacher,
    color: "#8b5cf6",
    details: ["Competency Training", "Safety Communication", "Lessons Learned", "Bulletin Boards"]
  }
];

export const SmsPillars = () => {
  return (
    <section className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="flex items-center gap-3">
            <Cpu size={16} variant="Bold" color="#3b82f6" className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">ICAO_ANNEX_19_COMPLIANCE</span>
          </div>
          <h3 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            The Four Pillars of Safety.
          </h3>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            International Civil Aviation Organization (ICAO) Annex 19 mandates a structured Safety Management System. AQSAMS translates these regulatory pillars into digital workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-700/60 transition-all group"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300 group-hover:bg-slate-950/80 transition-colors">
                    <pillar.icon size={24} variant="Bulk" color={pillar.color} />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                    {pillar.num}
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white tracking-tight">{pillar.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>

              {/* Sub-elements bullet list */}
              <div className="mt-8 pt-6 border-t border-slate-800/85 grid grid-cols-2 gap-3">
                {pillar.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wide font-mono uppercase">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
