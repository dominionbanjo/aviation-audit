"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArchiveBook, Lock, ArrowRight, DocumentText, Cpu } from "iconsax-react";

export const LibraryHighlights = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-[90px]" />

      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Copy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <ArchiveBook size={16} variant="Linear" color="#3b82f6" className="text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">NCAA_Compliance_Vault</span>
          </div>

          <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Digital Regulations Library (Nig. CARs).
          </h3>

          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            The platform is integrated with the official Nigeria Civil Aviation Regulations. Auditors can tie checklists directly to regulatory provisions, establishing a transparent compliance reference during oversight.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-border/80 p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-2.5 text-primary">
                <DocumentText size={18} variant="Bold" color="#3b82f6" />
                <h4 className="font-bold text-sm text-foreground">14 Regulation Parts</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full coverage of Nig. CARs Parts 1 to 14, including Airworthiness, Operations, and ATO requirements.
              </p>
            </div>

            <div className="bg-white border border-border/80 p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-2.5 text-amber-500">
                <Lock size={18} variant="Bold" color="#f59e0b" />
                <h4 className="font-bold text-sm text-foreground">Read-Only Vault</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Interactive modal viewer built to restrict document downloads or printing, maintaining documentation security.
              </p>
            </div>
          </div>

          <div>
            <Button size="lg" className="rounded-lg h-12 px-6 shadow-md shadow-primary/10 font-bold text-xs" asChild>
              <Link href="/documents">
                Explore Regulation Library
                <ArrowRight size={16} variant="Outline" color="currentColor" className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Side: Visual Mockup */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-border p-6 rounded-2xl shadow-xl space-y-6 relative z-10"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
                preview_vault
              </span>
            </div>

            {/* Document list mock */}
            <div className="space-y-3">
              {[
                { part: "Part 9", title: "Operator Certification", size: "5.0 MB" },
                { part: "Part 8", title: "Operations & Flight Crew", size: "9.4 MB" },
                { part: "Part 6", title: "Approved Maintenance Org", size: "3.8 MB" }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 rounded bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                      <DocumentText size={16} variant="Bold" color="#3b82f6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{doc.title}</div>
                      <div className="text-[9px] font-mono text-muted-foreground">{doc.part}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{doc.size}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary font-mono">
                <Cpu size={14} variant="Bold" color="currentColor" />
                <span>SECURED // BY_NCAA_DIRECTIVE</span>
              </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-primary/15 rounded-full -z-5 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
