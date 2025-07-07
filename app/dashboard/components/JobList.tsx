"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import JobForm from "./JobForm";
import JobModal from "./JobModal";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/app/context/AuthContext";
import { fetchJobs, createJob, updateJob, deleteJob } from "@/app/lib/api";
import type { Job } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function JobList() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<Job["status"] | "All">("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      setToken(data.session?.access_token ?? null);
    };
    getToken();
  }, [user]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchJobs(token)
      .then((res) => setJobs(res.jobs || []))
      .catch(() => {
        toast.error("Failed to load jobs");
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAdd = async (job: Job) => {
    if (!token) return;
    try {
      const payload = {
        title: job.title,
        company: job.company,
        status: job.status,
        notes: job.notes,
        appliedDate: new Date(job.appliedDate).toISOString(),
      };
      const res = await createJob(token, payload);
      setJobs((prev) => [res.job, ...prev]);
      toast.success("🎉 Job added!");
    } catch {
      toast.error("Failed to add job");
    }
  };

  const handleUpdate = async (job: Job) => {
    if (!token) return;
    try {
      const res = await updateJob(token, job.id, job);
      setJobs((prev) => prev.map((j) => (j.id === job.id ? res.job : j)));
      toast.success("✨ Job updated!");
      setEditingJob(null);
      setSelectedJob(null);
    } catch {
      toast.error("Failed to update job");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteJob(token, id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("🗑️ Job deleted!");
      setEditingJob(null);
      setSelectedJob(null);
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="space-y-6 font-quirky">
      <JobForm onAdd={handleAdd} />

      <div className="flex items-center gap-4 bg-light px-4 py-2 rounded-xl text-center justify-center">
        <span className="font-semibold text-primary">Filter by status:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] border-primary focus:ring-accent">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-light text-primary rounded-xl shadow-xl">
            {["All", "Applied", "Interviewing", "Offer", "Rejected"].map(
              (s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-accent" />
          </motion.div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => {
                setEditingJob(job);
                setSelectedJob(job);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <JobModal
        isOpen={!!selectedJob}
        onClose={() => {
          setSelectedJob(null);
          setEditingJob(null);
        }}
        job={selectedJob}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isEditing={!!editingJob}
      />
    </div>
  );
}
