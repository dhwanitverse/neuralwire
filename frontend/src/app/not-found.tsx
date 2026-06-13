import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="hero-mesh grid-pattern flex min-h-[80vh] items-center justify-center px-4">
      <div className="glow-orb left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-indigo-600/20" />
      <div className="relative text-center">
        <p className="font-display text-[10rem] font-bold leading-none text-white/5">404</p>
        <div className="-mt-16">
          <h1 className="font-display text-3xl font-bold text-white">Page not found</h1>
          <p className="mt-3 text-slate-400">This page doesn&apos;t exist or was moved.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link href="/blogs" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">
              <Search className="h-4 w-4" /> Browse Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
