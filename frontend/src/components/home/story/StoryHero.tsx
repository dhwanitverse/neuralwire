'use client';

import Link from 'next/link';
import { ChevronDown, Search, Sparkles, ArrowRight, Activity } from 'lucide-react';
import IntelligenceMap from '@/components/home/IntelligenceMap';
import { Parallax } from '@/components/home/story/Parallax';
import { openCommandPalette } from '@/lib/openSearch';
import { BRAND } from '@/lib/brand';

const STATS = [
  { value: '10K+', label: 'Stories indexed' },
  { value: '6', label: 'Intelligence domains' },
  { value: 'Live', label: 'Signal coverage' },
];

export default function StoryHero() {
  return (
    <div className="relative min-h-[calc(100dvh-var(--site-header-offset,100px))] overflow-hidden">
      <Parallax className="pointer-events-none absolute -inset-y-24 inset-x-0" distance={60}>
        <div className="absolute inset-0 nw-hero-grid opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_30%_-5%,rgba(59,130,246,0.16),transparent_55%),radial-gradient(ellipse_55%_45%_at_100%_60%,rgba(139,92,246,0.14),transparent_50%)]" />
      </Parallax>

      <div className="relative mx-auto flex min-h-[calc(100dvh-var(--site-header-offset,100px))] max-w-7xl flex-col justify-center px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left — message */}
          <div>
            <div className="page-enter nw-hero-badge [animation-delay:60ms]">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>The intelligence layer for technology</span>
            </div>

            <h1 className="font-display page-enter mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl xl:text-[5rem] [animation-delay:120ms]">
              The intelligence
              <span className="block">
                layer of <span className="nw-hero-gradient">tomorrow.</span>
              </span>
            </h1>

            <p className="page-enter mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg [animation-delay:200ms]">
              {BRAND.heroSubheadline} One continuous, living journey through the
              signal that actually matters.
            </p>

            {/* Search experience */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="nw-hero-search page-enter mt-8 [animation-delay:240ms]"
            >
              <Search className="h-4 w-4 shrink-0 text-violet-400" />
              <span className="truncate text-slate-500">
                Search AI, startups, security, engineering…
              </span>
              <kbd className="nw-nav-kbd ml-auto hidden sm:inline-flex">Ctrl K</kbd>
            </button>

            {/* CTAs */}
            <div className="page-enter mt-6 flex flex-wrap items-center gap-3 [animation-delay:300ms]">
              <Link href="/blogs" className="nw-hero-cta-primary">
                <Sparkles className="h-4 w-4" />
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#journey-breaking" className="nw-hero-cta-ghost">
                Enter the journey
              </a>
            </div>

            {/* Stats */}
            <dl className="page-enter mt-10 flex flex-wrap gap-x-10 gap-y-4 [animation-delay:360ms]">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold tracking-tight text-white">
                    {s.value}
                  </dt>
                  <dd className="mt-0.5 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — interactive visualization */}
          <div className="page-enter relative [animation-delay:200ms]">
            <div className="nw-hero-viz">
              <div className="nw-hero-viz-glow pointer-events-none" aria-hidden />
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="nw-ai-status-dot" />
                  Live intelligence graph
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  Neural net
                </span>
              </div>
              <Parallax className="relative" distance={20} direction={-1}>
                <IntelligenceMap />
              </Parallax>
            </div>
          </div>
        </div>

        <a
          href="#journey-breaking"
          className="page-enter absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors hover:text-white [animation-delay:420ms]"
          aria-label="Scroll to begin the journey"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll to begin</span>
          <ChevronDown className="nw-scroll-hint h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
