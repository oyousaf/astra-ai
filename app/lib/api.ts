const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface JobData {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

// 📥 Fetch all jobs (authenticated)
export async function fetchJobs(token: string) {
  const res = await fetch(`${API_URL}/jobs`, {
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
  const res = await fetch(`${API_URL}/jobs`, {
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
  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
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
  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
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

// ✨ Extract job details from pasted posting text via AI
export async function extractJobFromText(token: string, text: string) {
  const res = await fetch(`${API_URL}/ai/extract-job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "AI extraction failed");
  }

  return res.json();
}
