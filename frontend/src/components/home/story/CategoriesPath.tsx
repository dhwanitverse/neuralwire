'use client';

import Link from 'next/link';
import {
  Brain, Rocket, Code2, Shield, Cloud, Lightbulb,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'AI', href: '/blogs?category=Artificial%20Intelligence', icon: Brain, color: 'text-violet-400', ring: 'ring-violet-500/30', bg: 'bg-violet-500/10' },
  { label: 'Startups', href: '/blogs?category=Tech%20News', icon: Rocket, color: 'text-amber-400', ring: 'ring-amber-500/30', bg: 'bg-amber-500/10' },
  { label: 'Programming', href: '/blogs?category=Programming', icon: Code2, color: 'text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
  { label: 'Cybersecurity', href: '/blogs?category=Cyber%20Security', icon: Shield, color: 'text-rose-400', ring: 'ring-rose-500/30', bg: 'bg-rose-500/10' },
  { label: 'Cloud', href: '/blogs?category=Cloud%20Computing', icon: Cloud, color: 'text-sky-400', ring: 'ring-sky-500/30', bg: 'bg-sky-500/10' },
  { label: 'Innovation', href: '/blogs?category=Gadgets', icon: Lightbulb, color: 'text-cyan-400', ring: 'ring-cyan-500/30', bg: 'bg-cyan-500/10' },
];

export default function CategoriesPath() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-8 bottom-8 hidden w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/30 via-cyan-400/20 to-violet-500/30 md:block" aria-hidden />

      <div className="relative space-y-6 md:space-y-0">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const isLeft = i % 2 === 0;
          return (
            <Link
              key={cat.label}
              href={cat.href}
              className={`nw-category-node group relative flex md:min-h-[100px] md:w-1/2 md:py-4 ${
                isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12 md:text-right'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className={`nw-surface-card flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] p-5 transition-all duration-300 group-hover:border-violet-500/30 group-hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.35)] ${
                  !isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cat.bg} ring-1 ${cat.ring}`}>
                  <Icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <div className={!isLeft ? 'md:text-right' : ''}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Domain {i + 1}</p>
                  <p className="font-display text-xl font-bold text-white group-hover:text-violet-200">{cat.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Explore intelligence →</p>
                </div>
              </div>
              <div
                className={`absolute top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-violet-400 bg-[var(--nw-bg)] shadow-[0_0_12px_rgba(139,92,246,0.5)] md:block ${
                  isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
