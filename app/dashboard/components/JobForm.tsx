"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Job } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onAdd?: (job: Job) => void;
  onUpdate?: (job: Job) => void;
  jobToEdit?: Job | null;
  onCancelEdit?: () => void;
};

export default function JobForm({
  onAdd,
  onUpdate,
  jobToEdit,
  onCancelEdit,
}: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setCompany(jobToEdit.company);
      setStatus(jobToEdit.status);
      setAppliedDate(jobToEdit.appliedDate.slice(0, 10));
      setNotes(jobToEdit.notes || "");
    } else {
      setTitle("");
      setCompany("");
      setStatus("Applied");
      setAppliedDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [jobToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !appliedDate || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newJob: Job = {
      id: jobToEdit ? jobToEdit.id : Date.now(),
      title,
      company,
      status,
      appliedDate,
      notes: notes.trim() ? notes : undefined,
    };

    if (jobToEdit && onUpdate) {
      onUpdate(newJob);
      toast.success("✨ Job updated!");
      if (onCancelEdit) onCancelEdit();
    } else if (onAdd) {
      onAdd(newJob);
    }
    
    if (!jobToEdit) {
      setTitle("");
      setCompany("");
      setStatus("Applied");
      setAppliedDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-light text-center border border-accent p-6 rounded-2xl shadow-xl backdrop-blur-xl"
    >
      <div className="grid gap-4 md:grid-cols-5 sm:grid-cols-3 items-center text-center justify-center">
        <input
          type="text"
          placeholder="Job Title"
          className="input-style text-center"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Company"
          className="input-style text-center"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full border-primary focus:ring-accent bg-light rounded-xl justify-center">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-light text-primary rounded-xl shadow-xl">
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interviewing">Interviewing</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col items-center gap-1">
          <label htmlFor="appliedDate" className="text-primary font-semibold">
            Applied on:
          </label>
          <input
            id="appliedDate"
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="input-style text-center"
            required
          />
        </div>

        <textarea
          placeholder="Notes (optional)"
          className="input-style mt-4 w-full text-center"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <motion.div
        className="mt-4 flex gap-4 text-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          type="submit"
          className="px-5 py-2 bg-primary text-accent rounded-xl shadow-md hover:bg-primary transition-all duration-200 cursor-pointer"
        >
          {jobToEdit ? "🛠 Update Job" : "➕ Add Job"}
        </button>

        {jobToEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.form>
  );
}
