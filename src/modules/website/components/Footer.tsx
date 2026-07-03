"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_LINKS } from "../constants/menu-items";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start gap-12 mb-12">
          <div className="md:w-1/2">
            <Logo className="mb-6" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              AQSAMS is the leading platform for aviation quality and safety audit management,
              helping organizations maintain compliance with ICAO, IATA, and local regulations.
            </p>
          </div>

          <div className="md:w-1/2">
            <h4 className="font-bold mb-6 italic">Quick Links</h4>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-all text-sm whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
           <p>© 2026 AQSAMS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};
