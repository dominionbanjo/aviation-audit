import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  className?: string;
  isLoading?: boolean;
  description?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
  className,
  isLoading = false,
  description,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-muted/40 border-border/50 backdrop-blur shadow-none", className)}>
      <CardContent className="p-5 flex items-center gap-5">
        <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center shrink-0 border border-border/50 shadow-inner", iconBgClass, iconColorClass)}>
          {isLoading ? (
            <Skeleton className="h-6 w-6 rounded-full" />
          ) : (
            icon
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              value
            )}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
            {title}
          </div>
          {description && !isLoading && (
            <div className="mt-2">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
