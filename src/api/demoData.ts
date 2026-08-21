// Demo data used as a fallback when the backend is unreachable,
// so the live preview shows a populated app without a running server.
// All mutations persist in-memory for the session only.

import type { Job, NewJob, NewApplication } from './client';

let demoId = 1000;
const nextId = () => `demo_${demoId++}`;

const seed: Job[] = [
  {
    _id: 'demo_1',
    title: 'Senior Frontend Engineer',
    company: 'Acme Inc.',
    location: 'Remote',
    salary: '$130k – $160k',
    description:
      'We are looking for a senior frontend engineer to build delightful React experiences and mentor junior developers. You will own key parts of our design system.',
    postedBy: '65f1c2a3b4d5e6f7a8b9c0d1',
    applicants: [
      { name: 'Sarah Chen', email: 'sarah@example.com', coverLetter: 'I love React!' },
      { name: 'Marcus Lee', email: 'marcus@example.com', coverLetter: '' },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'demo_2',
    title: 'Product Designer',
    company: 'Lumen Labs',
    location: 'New York, NY',
    salary: '$110k – $140k',
    description:
      'Join our design team to shape the visual language of our flagship product. Strong portfolio in Figma and prototyping required.',
    postedBy: '65f1c2a3b4d5e6f7a8b9c0d1',
    applicants: [{ name: 'Priya Patel', email: 'priya@example.com', coverLetter: '10 years in SaaS design.' }],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: 'demo_3',
    title: 'Backend Engineer (Node.js)',
    company: 'Quanta Corp',
    location: 'Berlin (Hybrid)',
    salary: '€70k – €95k',
    description:
      'Design and scale our Node.js + MongoDB services. Experience with Express, microservices, and cloud deployment expected.',
    postedBy: '65f1c2a3b4d5e6f7a8b9c0d1',
    applicants: [],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

let store: Job[] = seed.map((j) => ({ ...j, applicants: [...j.applicants] }));
const CURRENT_USER = '65f1c2a3b4d5e6f7a8b9c0d1';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function demoGetJobs(): Promise<Job[]> {
  await delay(300);
  return store.map((j) => ({ ...j, applicants: [...j.applicants] }));
}

export async function demoGetMyJobs(): Promise<Job[]> {
  await delay(300);
  return store
    .filter((j) => j.postedBy === CURRENT_USER)
    .map((j) => ({ ...j, applicants: [...j.applicants] }));
}

export async function demoCreateJob(payload: NewJob): Promise<Job> {
  await delay(400);
  const job: Job = {
    _id: nextId(),
    ...payload,
    postedBy: CURRENT_USER,
    applicants: [],
    createdAt: new Date().toISOString(),
  };
  store = [job, ...store];
  return job;
}

export async function demoApplyToJob(id: string, payload: NewApplication): Promise<Job> {
  await delay(400);
  const job = store.find((j) => j._id === id);
  if (!job) throw new Error('Job not found');
  job.applicants.push({ ...payload, appliedBy: CURRENT_USER });
  return { ...job, applicants: [...job.applicants] };
}
