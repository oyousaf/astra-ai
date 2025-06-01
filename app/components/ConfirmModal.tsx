"use client";
import { motion, AnimatePresence } from "framer-motion";

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
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-light rounded-2xl p-8 max-w-xs w-full shadow-2xl text-center"
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.92 }}
        >
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {message && <p className="mb-4 text-gray-700">{message}</p>}
          <div className="flex gap-4 justify-center mt-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold cursor-pointer"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
