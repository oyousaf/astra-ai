import axios from "axios";

// ✅ Use relative paths so it works in both dev and production
const api = axios.create();

interface JobData {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

// ✅ AUTH ROUTES

export async function registerUser(email: string, password: string) {
  return api.post("/api/auth/register", { email, password });
}

export async function loginUser(email: string, password: string) {
  return api.post("/api/auth/login", { email, password });
}

// ✅ JOB ROUTES

export async function fetchJobs(token: string) {
  return api.get("/api/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createJob(token: string, jobData: JobData) {
  return api.post("/api/jobs", jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateJob(
  token: string,
  jobId: string,
  jobData: Partial<JobData>
) {
  return api.patch(`/api/jobs/${jobId}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteJob(token: string, jobId: string) {
  return api.delete(`/api/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default api;
