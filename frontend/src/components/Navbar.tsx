import { Home, LayoutDashboard, PlusCircle } from 'lucide-react';
import Logo from './Logo';

export type Page = 'feed' | 'post' | 'dashboard';

type Props = {
  current: Page;
  onNavigate: (page: Page) => void;
};

const items: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'feed', label: 'Job Feed', icon: Home },
  { id: 'post', label: 'Post a Job', icon: PlusCircle },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar({ current, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => onNavigate('feed')} className="transition hover:opacity-80">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 sm:flex">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                current === id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* mobile tab bar */}
      <nav className="flex border-t border-slate-200 sm:hidden">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
              current === id ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
