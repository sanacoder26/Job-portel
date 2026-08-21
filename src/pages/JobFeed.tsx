import { useState } from 'react';
import {
  Building2,
  MapPin,
  Banknote,
  Search,
  Send,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import { applyToJob, type Job } from '@/api/client';
import { demoApplyToJob } from '@/api/demoData';

type Props = {
  jobs: Job[];
  loading: boolean;
  usingDemo: boolean;
  onApplied: () => void;
};

export default function JobFeed({ jobs, loading, usingDemo, onApplied }: Props) {
  const [query, setQuery] = useState('');
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const filtered = jobs.filter((j) => {
    const q = query.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Open positions
        </h1>
        <p className="mt-2 text-slate-500">
          {jobs.length} {jobs.length === 1 ? 'role' : 'roles'} hiring now
          {usingDemo && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              demo data
            </span>
          )}
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, company, or location…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center py-20 text-center">
          <p className="text-slate-500">No jobs match your search.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <article
              key={job._id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.applicants.length} applicants
                </span>
              </div>

              <h3 className="text-lg font-semibold leading-snug text-slate-900">
                {job.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald-600">{job.company}</p>

              <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> {job.location}
                </p>
                <p className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-slate-400" /> {job.salary}
                </p>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>

              <button
                onClick={() => setApplyJob(job)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" /> Apply now
              </button>
            </article>
          ))}
        </div>
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          usingDemo={usingDemo}
          onClose={() => setApplyJob(null)}
          onApplied={() => {
            setApplyJob(null);
            onApplied();
          }}
        />
      )}
    </div>
  );
}

function ApplyModal({
  job,
  usingDemo,
  onClose,
  onApplied,
}: {
  job: Job;
  usingDemo: boolean;
  onClose: () => void;
  onApplied: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    setError('');
    try {
      if (usingDemo) {
        await demoApplyToJob(job._id, { name, email, coverLetter });
      } else {
        await applyToJob(job._id, { name, email, coverLetter });
      }
      onApplied();
    } catch {
      setError('Could not submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              Applying to
            </p>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="jane@email.com"
            />
          </Field>
          <Field label="Cover letter (optional)">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="input resize-none"
              placeholder="Why are you a great fit?"
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Submit application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
