import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-muted/40 border-border/50 backdrop-blur shadow-none", className)}>
      <CardContent className="p-5 flex items-center gap-5">
        <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center shrink-0 border border-border/50 shadow-inner", iconBgClass, iconColorClass)}>
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
