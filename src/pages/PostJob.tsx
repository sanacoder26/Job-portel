import { useState } from 'react';
import { Briefcase, Building2, MapPin, Banknote, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { createJob, type NewJob } from '@/api/client';
import { demoCreateJob } from '@/api/demoData';

type Props = {
  usingDemo: boolean;
  onPosted: () => void;
};

const empty: NewJob = { title: '', company: '', location: '', salary: '', description: '' };

export default function PostJob({ usingDemo, onPosted }: Props) {
  const [form, setForm] = useState<NewJob>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof NewJob>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (usingDemo) {
        await demoCreateJob(form);
      } else {
        await createJob(form);
      }
      setForm(empty);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      onPosted();
    } catch {
      setError('Could not post the job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Post a job
        </h1>
        <p className="mt-2 text-slate-500">
          Reach thousands of candidates. Fill in the details below.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-5 w-5" /> Job posted successfully!
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <FieldRow icon={Briefcase} label="Job title">
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="input"
            placeholder="Senior Frontend Engineer"
          />
        </FieldRow>

        <FieldRow icon={Building2} label="Company">
          <input
            required
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            className="input"
            placeholder="Acme Inc."
          />
        </FieldRow>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldRow icon={MapPin} label="Location">
            <input
              required
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              className="input"
              placeholder="Remote / San Francisco"
            />
          </FieldRow>
          <FieldRow icon={Banknote} label="Salary">
            <input
              required
              value={form.salary}
              onChange={(e) => set('salary', e.target.value)}
              className="input"
              placeholder="$120k – $150k"
            />
          </FieldRow>
        </div>

        <FieldRow icon={FileText} label="Description">
          <textarea
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={6}
            className="input resize-none"
            placeholder="Describe the role, responsibilities, and requirements…"
          />
        </FieldRow>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Publish job listing'
          )}
        </button>
      </form>
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Briefcase;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" /> {label}
      </span>
      {children}
    </label>
  );
}
