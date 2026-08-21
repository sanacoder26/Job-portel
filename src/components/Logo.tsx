import { Briefcase } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
        <Briefcase className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <p className="text-lg font-bold tracking-tight text-slate-900">
          Hire<span className="text-emerald-600">Hub</span>
        </p>
        <p className="text-[11px] font-medium text-slate-400">Find your next role</p>
      </div>
    </div>
  );
}
