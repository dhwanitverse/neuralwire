'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Radio } from 'lucide-react';
import IntelligenceMap from '@/components/home/IntelligenceMap';
import { BRAND } from '@/lib/brand';

export default function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/blogs${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--nw-bg)]">
      <div className="pointer-events-none absolute inset-0 nw-hero-grid" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_20%,rgba(139,92,246,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[var(--nw-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400"
            >
              <Radio className="h-3.5 w-3.5 text-cyan-400" />
              {BRAND.tagline}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.25rem]"
            >
              The Future of
              <span className="mt-1 block gradient-text">Intelligence.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              NeuralWire is the intelligence layer for technology — real-time AI news, deep research,
              startup signals, and engineering insight for decision-makers.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              onSubmit={onSearch}
              className="mt-8"
            >
              <div className="nw-ai-search group flex items-center gap-2 rounded-2xl p-2 pl-4">
                <Sparkles className="h-5 w-5 shrink-0 text-violet-400 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search intelligence — models, chips, policy, startups..."
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button type="submit" className="nw-btn-primary shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white">
                  <Search className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link href="/blogs" className="nw-btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
                Explore News <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#newsletter" className="nw-btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-slate-200">
                Subscribe
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44 }}
              className="mt-10 flex gap-8 border-t border-white/[0.06] pt-8"
            >
              {[
                { v: '2M+', l: 'Readers' },
                { v: '500+', l: 'Reports' },
                { v: '50+', l: 'Markets' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="nw-surface-card overflow-hidden rounded-3xl border border-white/[0.08] p-4 sm:p-6">
              <IntelligenceMap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
