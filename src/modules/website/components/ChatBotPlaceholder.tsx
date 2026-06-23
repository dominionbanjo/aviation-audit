"use client";

import { motion } from "framer-motion";
import { Messages1 } from "iconsax-react";

export const ChatBotPlaceholder = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-8 right-8 z-100"
    >
      <button className="group relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all scale-150 animate-pulse" />
        <div className="relative w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 border-t border-white/20 transform transition-transform group-hover:-translate-y-2">
           <Messages1 size={32} variant="Bulk" color="currentColor" />
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <div className="bg-card border border-border px-4 py-2 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap">
              Need assistance? Chat with AQSAMS AI
           </div>
        </div>
      </button>
    </motion.div>
  );
};
