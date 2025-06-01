"use client";

import { Job } from "@/types";
import { motion } from "framer-motion";

type JobCardProps = {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
};

const statusStyles = {
  Applied: {
    card: "bg-blue-500 text-white",
    company: "text-blue-100",
    badge: "bg-blue-100 text-blue-900",
    border: "border-blue-700",
  },
  Interviewing: {
    card: "bg-yellow-300 text-yellow-900",
    company: "text-yellow-900",
    badge: "bg-yellow-100 text-yellow-900",
    border: "border-yellow-500",
  },
  Offer: {
    card: "bg-green-500 text-white",
    company: "text-green-100",
    badge: "bg-green-100 text-green-900",
    border: "border-green-600",
  },
  Rejected: {
    card: "bg-red-500 text-white",
    company: "text-red-100",
    badge: "bg-red-100 text-red-900",
    border: "border-red-700",
  },
} as const;

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const status = job.status as keyof typeof statusStyles;
  const styles = statusStyles[status] ?? {
    card: "bg-white text-black",
    company: "text-white",
    badge: "bg-gray-100 text-gray-800",
    border: "border-gray-400",
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      onDelete(job.id);
    }
  };

  const formattedDate = job.appliedDate
    ? new Date(job.appliedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`${styles.card} ${styles.border} border-l-6 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col text-center justify-between select-none relative `}
      aria-label={`Job card for ${job.title} at ${job.company}`}
    >
      <div className="space-y-1">
        <h3 className="text-xl font-bold">{job.title}</h3>
        <p className={`${styles.company} text-md`}>{job.company}</p>

        <motion.span
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${styles.badge}`}
        >
          {job.status}
        </motion.span>

        {formattedDate && (
          <p className="text-sm mt-3 italic opacity-80">
            📅 Applied on: {formattedDate}
          </p>
        )}

        {job.notes && (
          <p className="mt-2 text-sm bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            📝 {job.notes}
          </p>
        )}
      </div>

      <div className="absolute top-3 right-3 flex gap-3">
        <button
          aria-label="Edit job"
          onClick={(e) => {
            stopPropagation(e);
            onEdit(job);
          }}
          className="text-yellow-800 hover:text-yellow-900 transition cursor-pointer"
        >
          ✏️
        </button>
        <button
          aria-label="Delete job"
          onClick={(e) => {
            stopPropagation(e);
            handleDelete();
          }}
          className="text-red-700 hover:text-red-900 transition cursor-pointer"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
}
