'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Home, LayoutDashboard, X, Command, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Blog } from '@/types';
import { OPEN_SEARCH_EVENT } from '@/lib/openSearch';

const QUICK_LINKS = [
  { label: 'Home', href: '/', icon: Home, desc: 'NeuralWire homepage' },
  { label: 'All Articles', href: '/blogs', icon: FileText, desc: 'Browse the full archive' },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'Editorial studio' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpenSearch = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenSearch);
    };
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/blogs?search=${encodeURIComponent(q)}&limit=6`);
      setResults(res.data.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-[#030712]/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -12 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-[12%] z-[101] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 sm:top-[15%]"
            role="dialog"
            aria-label="Search"
          >
            <div className="surface-elevated overflow-hidden rounded-2xl shadow-2xl shadow-violet-500/10">
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/25">
                  <Search className="h-4 w-4 text-violet-400" />
                </div>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search NeuralWire…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <kbd className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-500 sm:inline">
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white sm:hidden"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[min(60vh,22rem)] overflow-y-auto scroll-area p-2">
                {!query && (
                  <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                    Quick links
                  </p>
                )}
                {!query &&
                  QUICK_LINKS.map((link) => (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => navigate(link.href)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] transition-colors group-hover:bg-violet-500/15 group-hover:ring-violet-500/25">
                        <link.icon className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">{link.label}</p>
                        <p className="text-xs text-slate-500">{link.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </button>
                  ))}

                {query && loading && (
                  <div className="space-y-2 px-2 py-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3 rounded-xl p-2">
                        <div className="skeleton h-9 w-9 shrink-0 rounded-lg" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="skeleton h-3.5 w-3/4 rounded" />
                          <div className="skeleton h-2.5 w-1/3 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {query && !loading && results.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-slate-400">No articles found</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Try &ldquo;{query}&rdquo; with different keywords
                    </p>
                  </div>
                )}

                {results.map((b) => (
                  <button
                    key={b._id}
                    type="button"
                    onClick={() => navigate(`/blogs/${b._id}`)}
                    className="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                      <FileText className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-white group-hover:text-violet-200">
                        {b.title}
                      </p>
                      <p className="text-xs text-slate-500">{b.category}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[10px] text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Command className="h-3 w-3" /> NeuralWire Search
                </span>
                <span className="hidden sm:inline">
                  <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">⌘K</kbd> toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
