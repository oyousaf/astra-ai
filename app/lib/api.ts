export interface JobData {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

// 📥 Fetch all jobs (authenticated)
export async function fetchJobs(token: string) {
  const res = await fetch("/api/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to fetch jobs");
  }

  return res.json();
}

// ➕ Create a new job
export async function createJob(token: string, jobData: JobData) {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to create job");
  }

  return res.json();
}

// ✏️ Update a job
export async function updateJob(
  token: string,
  jobId: number,
  jobData: Partial<JobData>
) {
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to update job");
  }

  return res.json();
}

// ❌ Delete a job
export async function deleteJob(token: string, jobId: number) {
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to delete job");
  }

  return res.json();
}
