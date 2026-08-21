import axios from 'axios';

// ┌─────────────────────────────────────────────────────────────┐
// │  Central API config                                          │
// │  Change BASE_URL to your hosted backend URL at any time.    │
// └─────────────────────────────────────────────────────────────┘
export const BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

// Dummy JWT used by the backend's placeholder auth middleware.
// Swap for your real auth flow later.
const DEMO_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFjMmEzYjRkNWU2ZjdhOGI5YzBkMSIsIm5hbWUiOiJEZW1vIFVzZXIiLCJlbWFpbCI6ImRlbW9Aam9icG9ydGFsLmxvY2FsIiwiaWF0IjoxNzAwMDAwMDAwfQ.placeholder';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${DEMO_TOKEN}` },
});

export type Applicant = {
  name: string;
  email: string;
  coverLetter?: string;
  appliedBy?: string;
};

export type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  postedBy: string;
  applicants: Applicant[];
  createdAt: string;
};

export type NewJob = {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
};

export type NewApplication = {
  name: string;
  email: string;
  coverLetter?: string;
};

// ── Job API calls ────────────────────────────────────────────
export async function getJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/jobs');
  return data;
}

export async function createJob(payload: NewJob): Promise<Job> {
  const { data } = await api.post<Job>('/jobs', payload);
  return data;
}

export async function getMyJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/jobs/my');
  return data;
}

export async function applyToJob(id: string, payload: NewApplication): Promise<Job> {
  const { data } = await api.post<Job>(`/jobs/${id}/apply`, payload);
  return data;
}
