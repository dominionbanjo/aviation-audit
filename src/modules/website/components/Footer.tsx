"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_LINKS } from "../constants/menu-items";
import { Facebook, Instagram, DirectRight, Global } from "iconsax-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Logo className="mb-6" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              AQSAMS is the leading platform for aviation quality and safety audit management,
              helping organizations maintain compliance with ICAO, IATA, and local regulations.
            </p>
            <div className="flex gap-4">
               {[Facebook, Instagram, DirectRight, Global].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <Icon size={20} variant="Bulk" color="currentColor" />
                  </Link>
               ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 italic">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-all text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 italic">Regulatory Compliance</h4>
            <ul className="space-y-4">
              {["ICAO Annexes", "Nigerian CARs", "IATA (IOSA/ISAGO)", "EASA Standards", "FAA Regulations"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-all text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 italic">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">Stay updated with the latest in aviation safety and regulation.</p>
            <div className="relative">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
               />
               <button className="absolute right-2 top-2 bottom-2 bg-primary text-primary-foreground text-xs px-3 rounded-lg font-bold">
                 Join
               </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
           <p>© 2026 AQSAMS. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-8">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Security</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};
