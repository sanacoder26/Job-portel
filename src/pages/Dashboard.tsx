import { useState } from 'react';
import { Users, ChevronDown, Building2, MapPin, Banknote, Inbox } from 'lucide-react';
import type { Job, Applicant } from '@/api/client';

type Props = {
  jobs: Job[];
  loading: boolean;
};

export default function Dashboard({ jobs, loading }: Props) {
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Your dashboard
        </h1>
        <p className="mt-2 text-slate-500">Jobs you've posted and who applied.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Jobs posted" value={jobs.length} />
        <StatCard label="Total applicants" value={totalApplicants} />
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
          <Inbox className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobRow key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">{job.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" /> {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Banknote className="h-4 w-4 text-slate-400" /> {job.salary}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <Users className="h-4 w-4" />
            {job.applicants.length}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5">
          {job.applicants.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No applicants yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {job.applicants.map((a, i) => (
                <ApplicantRow key={i} applicant={a} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ApplicantRow({ applicant }: { applicant: Applicant }) {
  const initials = applicant.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <li className="flex items-start gap-3 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        {initials || '?'}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{applicant.name}</p>
        <p className="text-sm text-slate-500">{applicant.email}</p>
        {applicant.coverLetter && (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {applicant.coverLetter}
          </p>
        )}
      </div>
    </li>
  );
}
