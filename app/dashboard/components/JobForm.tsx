"use client";

import { useState, useRef } from "react";
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
import DatePicker from "react-datepicker";
import Confetti from "react-confetti";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  onAdd?: (job: Job) => void;
};

export default function JobForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !appliedDate || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    const isoDate = appliedDate.toISOString().split("T")[0];

    const newJob: Job = {
      id: Date.now(),
      title,
      company,
      status,
      appliedDate: isoDate,
      notes: notes.trim() ? notes : undefined,
    };

    //await new Promise((res) => setTimeout(res, 500));

    if (onAdd) {
      onAdd(newJob);
      toast.success("🎉 Job added!");
    }

    setTitle("");
    setCompany("");
    setStatus("Applied");
    setAppliedDate(new Date());
    setNotes("");
    setConfetti(true);
    setLoading(false);

    setTimeout(() => setConfetti(false), 5000);

    formRef.current?.querySelector<HTMLInputElement>("#job-title")?.focus();
  };

  return (
    <motion.form
      ref={formRef}
      id="job-form"
      name="job-form"
      autoComplete="on"
      onSubmit={handleSubmit}
      role="form"
      aria-label="Add Job Form"
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-light text-center border border-accent p-6 rounded-2xl shadow-xl backdrop-blur-xl relative"
      tabIndex={-1}
    >
      {/* Confetti burst */}
      {confetti && (
        <Confetti
          numberOfPieces={140}
          recycle={false}
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.18}
          tweenDuration={1800}
          className="pointer-events-none fixed inset-0 z-[10000]"
        />
      )}

      <div className="grid gap-4 md:grid-cols-5 sm:grid-cols-3 items-center text-center justify-center">
        <input
          id="job-title"
          name="job-title"
          type="text"
          placeholder="Job Title"
          autoComplete="off"
          className="input-style text-center"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          aria-required="true"
        />
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Company"
          autoComplete="organization"
          className="input-style text-center"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          disabled={loading}
          aria-required="true"
        />

        <Select
          value={status}
          onValueChange={setStatus}
          name="status"
          disabled={loading}
        >
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

        <div className="flex flex-col items-center gap-1 z-10">
          <DatePicker
            id="applied-date"
            selected={appliedDate}
            onChange={(date) => setAppliedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="input-style text-center"
            placeholderText="Select date"
            portalId="datepicker-portal"
            wrapperClassName="w-full"
            required
            maxDate={new Date()}
            disabled={loading}
          />
        </div>

        <textarea
          id="notes"
          name="notes"
          placeholder="Notes (optional)"
          autoComplete="off"
          className="input-style mt-4 w-full text-center"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
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
          className="px-5 py-2 bg-primary text-accent rounded-xl shadow-md hover:bg-primary transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          aria-busy={loading}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin mr-1"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Adding...
            </>
          ) : (
            <>➕ Add Job</>
          )}
        </button>
      </motion.div>
      <div aria-live="polite" className="sr-only" />
    </motion.form>
  );
}
