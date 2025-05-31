"use client";

import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JobForm from "./JobForm";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import JobModal from "./JobModal";
import { Job } from "@/types";
import { toast } from "sonner";
import { fetchJobs, createJob, updateJob, deleteJob } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function JobList() {
  const { token } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchJobs(token)
      .then((res) => setJobs(res.data))
      .catch(() => toast.error("Failed to load jobs"))
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
      setJobs((prev) => [res.data, ...prev]);
      toast.success("🎉 Job added!");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        toast.error(
          (error as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        toast.error("Failed to add job");
      }
      console.error("Add job error:", error);
    }
  };

  const handleUpdate = async (updatedJob: Job) => {
    if (!token) return;
    try {
      const res = await updateJob(token, updatedJob.id, updatedJob);
      setJobs((prev) =>
        prev.map((job) => (job.id === updatedJob.id ? res.data : job))
      );
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
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("🗑️ Job deleted!");
      setSelectedJob(null);
      setEditingJob(null);
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="space-y-6 font-quirky">
      <JobForm onAdd={handleAdd} />

      <div className="flex items-center gap-4 bg-light px-4 py-2 rounded-xl text-center justify-center">
        <span className="font-semibold text-primary">Filter by status:</span>
        <Select onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] border-primary focus:ring-accent">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-light text-primary rounded-xl shadow-xl">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interviewing">Interviewing</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={(job) => {
              setEditingJob(job);
              setSelectedJob(job);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

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
