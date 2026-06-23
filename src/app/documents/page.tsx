"use client";

import { useState } from "react";
import { Navbar } from "@/modules/website/components/Navbar";
import { Footer } from "@/modules/website/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DocumentText, 
  SearchNormal1, 
  CloseCircle, 
  ArchiveBook, 
  InfoCircle 
} from "iconsax-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

const DOCUMENTS = [
  {
    part: "Part 1",
    title: "General Policies, Procedures, and Definitions",
    filename: "nig-cars-part-1-general-policies-procedures-and-definitions.pdf",
    desc: "Establishes general administrative rules, compliance processes, and foundational definitions applicable to all other parts of the Nigeria Civil Aviation Regulations.",
    size: "4.8 MB"
  },
  {
    part: "Part 2",
    title: "Personnel Licensing",
    filename: "nig-cars-part-2-personnel-licensing.pdf",
    desc: "Governs the validation and issuance requirements for flight crew, aircraft maintenance personnel, air traffic controllers, and other licensed specialists.",
    size: "7.4 MB"
  },
  {
    part: "Part 3",
    title: "Approved Training Organization",
    filename: "nig-cars-part-3-approved-training-organization.pdf",
    desc: "Specifies authorization rules, certificate requirements, and operational rules for aviation training centers inside Nigeria.",
    size: "2.9 MB"
  },
  {
    part: "Part 4",
    title: "Aircraft Registration and Marking",
    filename: "nig-cars-part-4-aircraft-registration-and-marking.pdf",
    desc: "Details criteria for registering civil aircraft in Nigeria and the required formatting for nationality and registration markings.",
    size: "1.5 MB"
  },
  {
    part: "Part 5",
    title: "Airworthiness",
    filename: "nig-cars-part-5-airworthiness.pdf",
    desc: "Establishes engineering requirements, safety standard guidelines, and airworthiness directives for maintaining civil aircraft.",
    size: "2.8 MB"
  },
  {
    part: "Part 6",
    title: "Approved Maintenance Organization",
    filename: "nig-cars-part-6-approved-maintenance-organization.pdf",
    desc: "Defines standards, facilities, safety protocols, and rating procedures for certified aircraft repair and service stations (AMOs).",
    size: "3.8 MB"
  },
  {
    part: "Part 7",
    title: "Instrument and Equipment",
    filename: "nig-cars-part-7-instrument-and-equipment.pdf",
    desc: "Details required onboard navigation systems, safety gear, communications electronics, and cockpit displays for flight operations.",
    size: "4.2 MB"
  },
  {
    part: "Part 8",
    title: "Operations",
    filename: "nig-cars-part-8-operations.pdf",
    desc: "Specifies operational guidelines for commercial operations, general aviation, charter routing, and emergency emergency procedures.",
    size: "9.4 MB"
  },
  {
    part: "Part 9",
    title: "Air Operator Certification and Administration",
    filename: "nig-cars-part-9-air-operator-certification-and-administration.pdf",
    desc: "Defines the rigorous 5-stage certification sequence for obtaining and preserving an Air Operator Certificate (AOC) in Nigeria.",
    size: "5.0 MB"
  },
  {
    part: "Part 10",
    title: "Commercial Air Transport by Foreign Air Operators Within Nigeria",
    filename: "nig-cars-part-10-commercial-air-transport-by-foreign-air-operators-within-nigeria.pdf",
    desc: "Lays down regulations, licensing, and compliance standards governing foreign airlines operating flight operations into Nigerian airspace.",
    size: "2.1 MB"
  },
  {
    part: "Part 11",
    title: "Aerial Work",
    filename: "nig-cars-part-11-aerial-work.pdf",
    desc: "Sets procedures and certifications for industrial aviation, including agricultural dusting, survey mapping, and air ambulance routing.",
    size: "3.3 MB"
  },
  {
    part: "Part 12 (Vol. I)",
    title: "Aerodrome Regulations",
    filename: "nig-cars-part-12-aerodrome-regulations-vol-i.pdf",
    desc: "Exhaustive specifications for airport runways, terminals, ground lights, approach vectors, and safety fire safety teams.",
    size: "22.4 MB"
  },
  {
    part: "Part 12 (Vol. II)",
    title: "Heliport Regulations",
    filename: "nig-cars-part-12-heliport-regulations-vol-ii.pdf",
    desc: "Regulates helipads, rooftop landing grids, signaling equipment, and obstacle clearance parameters for rotorcraft operation.",
    size: "6.8 MB"
  },
  {
    part: "Part 14",
    title: "Air Navigation Services",
    filename: "nig-cars-part-14-air-navigation-services-14-0-to-14-7.pdf",
    desc: "Establishes regulatory requirements for communications, meteorological monitoring, search-and-rescue grids, and airspace maps.",
    size: "17.0 MB"
  }
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDoc, setActiveDoc] = useState<typeof DOCUMENTS[0] | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 400);

  const filteredDocs = DOCUMENTS.filter((doc) =>
    doc.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    doc.part.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    doc.desc.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header Hero */}
        <section className="container mx-auto px-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-6">
              <ArchiveBook size={14} variant="Bold" color="currentColor" />
              NCAA Regulatory Library
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Civil Aviation Regulations
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore the canonical Nigeria Civil Aviation Regulations (Nig. CARs). These documents define the legal and operational standards governing safety oversight, operator certification, airworthiness, and license management across Nigerian aviation.
            </p>
          </div>
        </section>

        {/* Search Bar section */}
        <section className="container mx-auto px-6 mb-12">
          <div className="relative max-w-lg shadow-sm rounded-lg overflow-hidden border border-border bg-white group focus-within:border-primary/50 transition-colors">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <SearchNormal1 size={18} variant="Outline" color="currentColor" />
            </div>
            <Input
              type="text"
              placeholder="Search by Part name, title, or regulation description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 border-none focus-visible:ring-0 shadow-none bg-transparent placeholder:text-muted-foreground/60 text-sm font-medium"
            />
          </div>
        </section>

        {/* Documents Directory Grid */}
        <section className="container mx-auto px-6">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border/80 rounded-2xl p-8 max-w-md mx-auto space-y-4">
              <div className="mx-auto w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                <InfoCircle size={24} variant="Outline" color="currentColor" />
              </div>
              <h3 className="font-bold text-lg">No regulations found</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't find any document matching "{searchQuery}". Try searching for terms like "Operations", "AOC", or "Airworthiness".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc.filename}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                >
                  <Card className="h-full border border-border/80 hover:border-primary/20 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden">
                    <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Part Tag and Size */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                            {doc.part}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono font-medium">
                            {doc.size}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {doc.desc}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-6 border-t border-border/60">
                        <Button
                          onClick={() => setActiveDoc(doc)}
                          className="w-full h-10 gap-2 cursor-pointer font-bold text-xs bg-slate-900 hover:bg-primary transition-colors text-white"
                        >
                          <DocumentText size={16} variant="Outline" color="currentColor" />
                          View Regulation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* ── DOCUMENT VIEWER POPUP ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 bg-slate-950/60 backdrop-blur-sm"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full h-full md:w-[92vw] md:h-[90vh] md:rounded-2xl border border-border shadow-2xl bg-white flex flex-col overflow-hidden"
            >
              {/* Header bar */}
              <div className="px-6 py-4.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8.5 w-8.5 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                    <DocumentText size={18} variant="Bold" color="currentColor" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider leading-none">
                      {activeDoc.part} // Civil Aviation Regulations
                    </span>
                    <h2 className="text-sm font-bold truncate text-slate-100 mt-1 leading-snug">
                      {activeDoc.title}
                    </h2>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-4 shrink-0 pl-4">
             
                  {/* Close button */}
                  <button
                    onClick={() => setActiveDoc(null)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Close document viewer"
                  >
                    <CloseCircle size={24} variant="Bold" color="currentColor" />
                  </button>
                </div>
              </div>

              {/* Frame viewer */}
              <div className="flex-1 w-full bg-slate-800 relative">
                {/* Embed PDF inside an iframe, toolbar=0 & navpanes=0 disables downloading capabilities */}
                <iframe
                  src={`/Documents/${activeDoc.filename}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-none bg-slate-800"
                  title={activeDoc.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
