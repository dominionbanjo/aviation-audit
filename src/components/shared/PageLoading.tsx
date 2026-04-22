"use client";

import React from "react";
import { Airplane } from "iconsax-react";
import { motion } from "framer-motion";

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Initializing Systems...", 
  fullScreen = true 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-background ${
        fullScreen ? "fixed inset-0 z-[9999]" : "h-full w-full py-12"
      }`}
    >
      <div className="relative">
        {/* Outer glowing rings */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-4 rounded-full border border-primary/20 bg-primary/5 blur-xl"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-8 rounded-full border border-primary/10 blur-2xl"
        />

        {/* Main Logo/Icon Container */}
        <div className="relative bg-foreground text-background p-5 rounded-2xl shadow-2xl shadow-primary/20 border border-white/10 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Airplane size={40} variant="Bold" color="currentColor" />
          </motion.div>
        </div>
      </div>

      {/* Progress Text */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <motion.span 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground"
        >
          {message}
        </motion.span>
        
        {/* Minimalist Progress Bar */}
        <div className="w-32 h-[2px] bg-muted rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-primary"
          />
        </div>
      </div>

      <div className="mt-20 text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">
        AQSAMS_CORE // SECURE_BOOT
      </div>
    </div>
  );
};
