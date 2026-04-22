import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string; // To allow custom width/styling for DialogContent
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn("sm:max-w-[425px] overflow-hidden", className)}
        aria-describedby={undefined}
      >
        {(title || description) && (
          <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20">
            {title && <DialogTitle className="text-xl font-bold">{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/10">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
