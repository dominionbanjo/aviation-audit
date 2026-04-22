"use client";

import React from "react";
import { Timer, ArrowLeft, Logout } from "iconsax-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Module Under Development", 
  description = "We're currently digitizing this oversight process. Check back soon for the full terminal experience." 
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 -m-6 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        
        <div className="relative bg-muted/30 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-primary"
          >
            <Timer size={64} variant="Bulk" color="currentColor" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              ETA: [REDACTED] // Q3 2024
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-20 border-t border-border pt-8 w-full max-w-sm">
        <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
          Terminal Node: 0x7E3 // System: Online
        </p>
      </div>
    </div>
  );
};
