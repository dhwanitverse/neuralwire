'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Parallax } from '@/components/home/story/Parallax';

export default function StoryFinalCTA() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-violet-600/20 via-[var(--nw-surface)] to-blue-600/15 p-10 text-center sm:p-16">
      <Parallax className="pointer-events-none absolute -inset-y-16 inset-x-0" distance={40}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
      </Parallax>
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">End of journey · Start of advantage</p>
        <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Stay Ahead of the Future
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-slate-400">
          Join the intelligence network. Get signal before the world catches on.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#journey-newsletter" className="nw-btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white">
            <Mail className="h-4 w-4" /> Subscribe
          </a>
          <Link href="/blogs" className="nw-btn-ghost inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white">
            Explore Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
