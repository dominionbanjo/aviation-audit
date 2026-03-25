import React from "react";
import { Airplane } from "iconsax-react";

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, iconSize = 24 }) => {
  return (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
      <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
        <Airplane size={iconSize} variant="Bold" color="currentColor" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
        AQSAMS
      </span>
    </div>
  );
};
