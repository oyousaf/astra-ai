"use client";

import React, { useState, useEffect } from "react";
import { Job } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

  if (!formData) return null;

  const handleChange = (name: string, value: string | Date) => {
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => formData && onUpdate(formData);

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className="max-w-md"
        aria-describedby={isEditing ? "" : undefined}
      >
        {!isEditing ? (
          <>
            <DialogTitle className="mb-1">{formData.title}</DialogTitle>
            <DialogDescription className="text-gray-200">
              {formData.company}
            </DialogDescription>
            <Field label="" value={formData.status} strong />
            <Field
              label="Applied Date: "
              value={formatDate(formData.appliedDate)}
            />
            <Field label="Notes: " value={formData.notes || "No notes added."} />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-foreground text-white px-4 py-2 rounded-xl hover:bg-background transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="mb-4">Edit Job</DialogTitle>

            <label htmlFor="title" className="block text-light font-semibold mb-1">
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

            <label htmlFor="company" className="block text-light font-semibold mb-1">
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

            <label htmlFor="status" className="block text-light font-semibold mb-1">
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

            <label htmlFor="appliedDate" className="block text-light font-semibold mb-1">
              Date Applied:
            </label>
            <div className="flex w-full mb-3">
              <DatePicker
                id="appliedDate"
                selected={parseDate(formData?.appliedDate)}
                onChange={(date) =>
                  handleChange(
                    "appliedDate",
                    date ? date.toISOString().slice(0, 10) : "",
                  )
                }
                className="bg-light text-primary w-full px-3 py-2 border rounded text-center"
                placeholderText="Select date"
                dateFormat="dd-MM-yyyy"
                wrapperClassName="w-full"
                maxDate={new Date()}
              />
            </div>

            <label htmlFor="notes" className="block text-light font-semibold mb-1">
              Notes:
            </label>
            <textarea
              id="notes"
              name="notes"
              autoComplete="off"
              value={formData?.notes || ""}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="bg-light text-primary w-full mb-3 px-3 py-2 border rounded resize-y min-h-20 text-center"
              placeholder="Any relevant notes go here..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-secondary/50 hover:bg-secondary text-white transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Save
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
