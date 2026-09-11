"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent
        className="max-w-xs bg-light text-primary"
        showCloseButton={false}
        aria-describedby={message ? undefined : ""}
      >
        <DialogTitle className="text-primary">{title}</DialogTitle>
        {message && (
          <DialogDescription className="mb-4 text-gray-700">
            {message}
          </DialogDescription>
        )}
        <div className="flex gap-4 justify-center mt-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
