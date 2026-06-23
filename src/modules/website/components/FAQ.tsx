"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown2, InfoCircle, MessageQuestion } from "iconsax-react";

const FAQS = [
  {
    q: "How does AQSAMS align with NCAA Civil Aviation Regulations?",
    a: "AQSAMS is built specifically around the Nigeria Civil Aviation Regulations (Nig. CARs). The audit checklists and templates map directly to the corresponding Parts of the regulations (e.g. Part 9 for Air Operator Certification, Part 6 for Approved Maintenance Organizations). This guarantees compliance throughout the audit trail."
  },
  {
    q: "What roles are available in the system?",
    a: "We implement Role-Based Access Control (RBAC) supporting three primary groups: (1) Administrators, who have absolute visibility and manage staff recruitment; (2) Auditors, who build audit templates, capture evidence, and inspect safety reports; and (3) OTP Responders, who log in solely to input on-time performance questionnaires."
  },
  {
    q: "Can users download or copy files from the Civil Aviation Regulations Library?",
    a: "No. To protect the integrity and security of NCAA official documentation, the Civil Aviation Regulations Library is a read-only terminal. Saving, downloading, printing, and right-clicking are restricted inside our custom modal PDF viewer."
  },
  {
    q: "How does on-time performance (OTP) tracking integrate with compliance?",
    a: "Airlines and airports record delay reasons using our SOP questionnaires. The platform categorizes delay causes (e.g. Technical, Ground Handling, Weather) and displays analytics that identify operational trends, helping operators prepare for NCAA oversight reviews."
  },
  {
    q: "How is finding level classification determined?",
    a: "Deficiencies are triaged into three severity levels: Level 1 (Critical non-compliance requiring immediate operations halt), Level 2 (Major finding requiring a Corrective Action Plan within 30 days), and Level 3 (Observation to improve standard operational procedures)."
  }
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-white border-t border-border relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <MessageQuestion size={14} variant="Bold" color="currentColor" />
            Frequently Asked Questions
          </div>
          <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Compliance & Terminal Questions
          </h3>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Everything you need to know about safety oversight certification, flight delay analysis, and regulation review.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-border/80 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <span className="font-bold text-foreground text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 shrink-0 ml-4"
                  >
                    <ArrowDown2 size={18} variant="Outline" color="currentColor" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-border/50 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        <div className="flex gap-2">
                          <InfoCircle size={16} variant="Outline" color="#3b82f6" className="shrink-0 mt-0.5" />
                          <span>{faq.a}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
