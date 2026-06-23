"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AirplaneSquare, Setting, TaskSquare, ShieldSecurity, ArrowRight } from "iconsax-react";

const SCOPES = [
  {
    id: "aoc",
    title: "Air Operator Certification (Part 9)",
    icon: AirplaneSquare,
    color: "#3b82f6",
    tagline: "Nig. CARs Part 9 Compliance Protocols",
    details: "Automates the 5-stage certification checklist required by the NCAA for obtaining and preserving an AOC. Tracks operations manuals (OM), security programs, and training curricula updates.",
    checks: [
      "OM-A, OM-B, OM-C, and OM-D tracking",
      "Post-holder authorization logs",
      "NCAA Phase 3 to 5 inspector sign-offs",
      "Dynamic operator profile tracking"
    ]
  },
  {
    id: "maintenance",
    title: "Airworthiness & AMOs (Part 5 & 6)",
    icon: Setting,
    color: "#10b981",
    tagline: "Nig. CARs Part 5 & 6 Maintenance Logs",
    details: "Covers Approved Maintenance Organization (AMO) audits. Validates hangar facilities, calibration logs for tools, mechanic certifications, and technical records for aircraft safety release.",
    checks: [
      "Technical logbook audits",
      "Tool calibration verification schedules",
      "Maintenance release authorizations",
      "Hangar safety and fire control checklists"
    ]
  },
  {
    id: "ops",
    title: "Flight Operations (Part 8)",
    icon: TaskSquare,
    color: "#f59e0b",
    tagline: "Nig. CARs Part 8 Commercial Flight Rules",
    details: "Ensures compliance with standard operational procedures during commercial flight routing. Checks dispatcher logs, flight planning databases, fuel calculators, and loadsheet accuracy.",
    checks: [
      "Route and aerodrome checks for crew",
      "Fuel calculation validation models",
      "Loadsheet auditing and weight logs",
      "Cabin safety and briefing records"
    ]
  },
  {
    id: "aerodrome",
    title: "Aerodromes & Ground Safety (Part 12)",
    icon: ShieldSecurity,
    color: "#8b5cf6",
    tagline: "Nig. CARs Part 12 Aerodrome Certifications",
    details: "Covers ground operations safety audits, airport marking standards, friction indices for runways, fire fighting category checks, and safety clearance zones.",
    checks: [
      "Runway and taxiway marking checks",
      "Ramp safety and fuel storage logs",
      "Heliport lighting and approach vectors",
      "Emergency rescue drill records"
    ]
  }
];

export const AuditScope = () => {
  const [activeTab, setActiveTab] = useState(SCOPES[0].id);

  const activeData = SCOPES.find((s) => s.id === activeTab)!;

  return (
    <section className="py-24 bg-white border-t border-border relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16 space-y-6">
          <div className="flex items-center gap-3">
            <AirplaneSquare size={16} variant="Linear" color="#3b82f6" className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">System_Audit_Framework</span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Aviation Audit Scope & Capabilities.
          </h3>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            Checklists are mapped to operational departments under Nig. CARs. Auditors can select corresponding parts and build checklist items dynamically.
          </p>
        </div>

        {/* Tabbed Layout Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Tabs selector */}
          <div className="lg:col-span-4 space-y-3.5">
            {SCOPES.map((scope) => {
              const isActive = scope.id === activeTab;
              return (
                <button
                  key={scope.id}
                  onClick={() => setActiveTab(scope.id)}
                  className={`w-full p-5 rounded-xl border text-left flex items-center gap-4 transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "bg-slate-50 border-border/80 text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    isActive ? "bg-white/10 text-white" : "bg-white border text-slate-500 shadow-sm"
                  }`}>
                    <scope.icon size={18} variant="Bold" color={isActive ? "#fff" : scope.color} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono opacity-50 font-semibold">{scope.tagline.split(" ")[0]}</div>
                    <div className="text-xs sm:text-sm font-bold truncate mt-0.5">{scope.title.split(" (")[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab description card */}
          <div className="lg:col-span-8 bg-slate-50/50 border border-border/80 rounded-2xl p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="text-xs font-bold text-primary font-mono uppercase tracking-wider">
                    {activeData.tagline}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground">
                    {activeData.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {activeData.details}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Key Certification Audits
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeData.checks.map((check, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-white shadow-sm">
                        <div className="mt-0.5 text-primary">
                          <ArrowRight size={14} variant="Outline" color="currentColor" />
                        </div>
                        <span className="text-xs text-slate-600 font-semibold leading-normal">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
