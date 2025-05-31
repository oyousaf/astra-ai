import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface JobData {
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

export async function registerUser(email: string, password: string) {
  return api.post("/auth/register", { email, password });
}

export async function loginUser(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}

export async function fetchJobs(token: string) {
  return api.get("/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createJob(token: string, jobData: JobData) {
  return api.post("/jobs", jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateJob(
  token: string,
  jobId: number,
  jobData: Partial<JobData>
) {
  return api.put(`/jobs/${jobId}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteJob(token: string, jobId: number) {
  return api.delete(`/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default api;
