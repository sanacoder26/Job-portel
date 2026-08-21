import { useCallback, useEffect, useState } from 'react';
import Navbar, { type Page } from '@/components/Navbar';
import JobFeed from '@/pages/JobFeed';
import PostJob from '@/pages/PostJob';
import Dashboard from '@/pages/Dashboard';
import { getJobs, getMyJobs, type Job } from '@/api/client';
import { demoGetJobs, demoGetMyJobs } from '@/api/demoData';

export default function App() {
  const [page, setPage] = useState<Page>('feed');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingDash, setLoadingDash] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  // Fetch the public job feed; fall back to demo data if backend is unreachable.
  const loadFeed = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const jobs = await getJobs();
      setAllJobs(jobs);
      setUsingDemo(false);
    } catch {
      setAllJobs(await demoGetJobs());
      setUsingDemo(true);
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  // Fetch the logged-in user's jobs; fall back to demo data if unreachable.
  const loadDashboard = useCallback(async () => {
    setLoadingDash(true);
    try {
      const jobs = await getMyJobs();
      setMyJobs(jobs);
      setUsingDemo(false);
    } catch {
      setMyJobs(await demoGetMyJobs());
      setUsingDemo(true);
    } finally {
      setLoadingDash(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Lazy-load dashboard data the first time the user opens that page.
  useEffect(() => {
    if (page === 'dashboard' && myJobs.length === 0 && loadingDash) {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function refresh() {
    loadFeed();
    if (page === 'dashboard' || myJobs.length > 0) loadDashboard();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar current={page} onNavigate={setPage} />
      <main>
        {page === 'feed' && (
          <JobFeed jobs={allJobs} loading={loadingFeed} usingDemo={usingDemo} onApplied={refresh} />
        )}
        {page === 'post' && <PostJob usingDemo={usingDemo} onPosted={refresh} />}
        {page === 'dashboard' && <Dashboard jobs={myJobs} loading={loadingDash} />}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        HireHub — MERN Job Portal
      </footer>
    </div>
  );
}
