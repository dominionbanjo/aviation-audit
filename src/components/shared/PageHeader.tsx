"use client";

import React from "react";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLabel?: string;
  backHref?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backLabel,
  backHref,
  action,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6", className)}>
      <div className="space-y-1.5">
        {backLabel && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1 mb-1 group"
          >
            <ArrowLeft2
              size={16}
              variant="Outline"
              color="currentColor"
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            {backLabel}
          </button>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </div>
  );
}
