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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type JobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onUpdate: (job: Job) => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
};

const parseDate = (date: string | Date | undefined): Date | null =>
  date ? new Date(date) : null;

const formatDate = (date: string | Date | undefined) =>
  date ? new Date(date).toLocaleDateString() : "";

export default function JobModal({
  isOpen,
  onClose,
  job,
  onUpdate,
  isEditing,
}: JobModalProps) {
  const [formData, setFormData] = useState<Job | null>(job);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setFormData(job);
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-backdrop") onClose();
  };

  const handleChange = (name: string, value: string | Date) => {
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => formData && onUpdate(formData);

  const Field = ({
    label,
    value,
    strong,
  }: {
    label?: string;
    value: React.ReactNode;
    strong?: boolean;
  }) => (
    <p className="mt-2 text-sm text-gray-300 text-center whitespace-pre-wrap">
      {label && <strong>{label}</strong>}
      {strong ? <span className="font-semibold">{value}</span> : value}
    </p>
  );

  return (
    <AnimatePresence>
      <motion.div
        id="modal-backdrop"
        role="dialog"
        aria-modal="true"
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-background/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-primary rounded-xl p-6 w-full max-w-md shadow-xl text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            <>
              <h2 className="text-light text-xl font-bold mb-1">{job.title}</h2>
              <p className="text-sm text-gray-200 text-center">{job.company}</p>
              <Field label="" value={job.status} strong />
              <Field
                label="Applied Date: "
                value={formatDate(job.appliedDate)}
              />
              <Field label="Notes: " value={job.notes || "No notes added."} />
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
                name="status"
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
                className="block text-light font-semibold mb-1"
              >
                Date Applied:
              </label>
              <div className="flex w-full mb-3">
                <DatePicker
                  id="appliedDate"
                  selected={parseDate(formData?.appliedDate)}
                  onChange={(date) =>
                    handleChange(
                      "appliedDate",
                      date ? date.toISOString().slice(0, 10) : ""
                    )
                  }
                  className="bg-light text-primary w-full px-3 py-2 border rounded text-center"
                  placeholderText="Select date"
                  dateFormat="dd-MM-yyyy"
                  wrapperClassName="w-full"
                  showPopperArrow={false}
                  maxDate={new Date()}
                />
              </div>

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
                placeholder="Any relevant notes go here..."
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
