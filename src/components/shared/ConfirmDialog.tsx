import { Modal } from "./Modal";
import { Button } from "@/components/ui/button";
import { Warning2 } from "iconsax-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="sm:max-w-[400px]"
    >
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="p-4 bg-destructive/10 rounded-full text-destructive">
          <Warning2 size={32} variant="Bulk" color="currentColor" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          {cancelText}
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
