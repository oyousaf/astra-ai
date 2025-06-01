"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Job } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onUpdate: (job: Job) => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
};

export default function JobModal({
  isOpen,
  onClose,
  job,
  onUpdate,
  isEditing,
}: JobModalProps) {
  const [formData, setFormData] = useState<Job | null>(job);

  useEffect(() => {
    setFormData(job);
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-backdrop") {
      onClose();
    }
  };

  const handleChange = (name: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (formData) {
      onUpdate(formData);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="modal-backdrop"
        role="dialog"
        aria-modal="true"
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-background/50 flex items-center justify-center text-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-primary text-center rounded-xl p-6 w-full max-w-md shadow-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            <>
              <h2 className="text-light text-xl font-bold">{job.title}</h2>
              <p className="text-sm text-gray-200">{job.company}</p>
              <p className="mt-2 font-semibold">{job.status}</p>

              <p className="mt-2 text-sm text-gray-300">
                <strong>Applied Date: </strong>
                {new Date(job.appliedDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
                <strong>Notes: </strong>
                {job.notes || "No notes added."}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="bg-foreground text-white px-4 py-2 rounded-xl hover:bg-background transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-light text-xl font-bold mb-4">Edit Job</h2>
              <label
                htmlFor="title"
                className="block text-light font-semibold mb-1"
              >
                Job Title:
              </label>
              <input
                id="title"
                name="title"
                type="text"
                autoComplete="off"
                value={formData?.title || ""}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="bg-light text-primary w-full mb-3 px-3 py-2 border rounded text-center"
                placeholder="Job Title"
              />

              <label
                htmlFor="company"
                className="block text-light font-semibold mb-1"
              >
                Company Name:
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData?.company || ""}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="bg-light text-primary w-full mb-3 px-3 py-2 border rounded text-center"
                placeholder="Company Name"
              />

              <label
                htmlFor="status"
                className="block text-light font-semibold mb-1"
              >
                Status:
              </label>
              <Select
                value={formData?.status || ""}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger
                  id="status"
                  className="w-full mb-3 bg-light text-primary border rounded px-3 py-2 justify-center"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-light text-primary rounded-xl shadow-xl">
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <label
                htmlFor="appliedDate"
                className="block text-light font-semibold mb-1 "
              >
                Date Applied:
              </label>
              <input
                id="appliedDate"
                name="appliedDate"
                type="date"
                autoComplete="date"
                value={
                  formData?.appliedDate
                    ? new Date(formData.appliedDate).toISOString().slice(0, 10)
                    : ""
                }
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="bg-light text-primary w-full mb-3 px-3 py-2 border rounded"
              />

              <label
                htmlFor="notes"
                className="block text-light font-semibold mb-1"
              >
                Notes:
              </label>
              <textarea
                id="notes"
                name="notes"
                autoComplete="off"
                value={formData?.notes || ""}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="bg-light text-primary w-full mb-3 px-3 py-2 border rounded resize-y min-h-[80px] text-center"
                placeholder="Add notes about the job"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-secondary/50 hover:bg-secondary text-white transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
