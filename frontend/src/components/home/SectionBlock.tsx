'use client';

import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export type SectionLayout =
  | 'default'
  | 'breaking'
  | 'trending'
  | 'radar'
  | 'startup'
  | 'dev'
  | 'cyber'
  | 'editors'
  | 'deep'
  | 'research'
  | 'authors';

const LAYOUT_STYLES: Record<SectionLayout, { section: string; decor?: string }> = {
  default: { section: 'bg-[var(--nw-bg)]' },
  breaking: {
    section: 'bg-[var(--nw-surface)] border-y border-red-500/10',
    decor: 'bg-[radial-gradient(ellipse_at_left,rgba(239,68,68,0.08),transparent_55%)]',
  },
  trending: {
    section: 'bg-[var(--nw-bg)]',
    decor: 'bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06),transparent_50%)]',
  },
  radar: {
    section: 'bg-[var(--nw-surface)]',
    decor: 'bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_55%)]',
  },
  startup: {
    section: 'bg-[var(--nw-bg)]',
    decor: 'bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.05),transparent_50%)]',
  },
  dev: {
    section: 'bg-[var(--nw-surface)] border-y border-emerald-500/10',
    decor: 'nw-hero-grid opacity-40',
  },
  cyber: {
    section: 'bg-[var(--nw-bg)]',
    decor: 'bg-[radial-gradient(ellipse_at_right,rgba(244,63,94,0.07),transparent_50%)]',
  },
  editors: {
    section: 'bg-[var(--nw-surface)]',
    decor: 'bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06),transparent_60%)]',
  },
  deep: {
    section: 'bg-[var(--nw-bg)] border-t border-white/[0.04]',
    decor: 'bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.08),transparent_55%)]',
  },
  research: {
    section: 'bg-[var(--nw-surface)]',
    decor: 'bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_50%)]',
  },
  authors: { section: 'bg-[var(--nw-bg)]' },
};

interface SectionBlockProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  href?: string;
  layout?: SectionLayout;
  children: ReactNode;
  accent?: ReactNode;
  number?: string;
}

export default function SectionBlock({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  href,
  layout = 'default',
  children,
  accent,
  number,
}: SectionBlockProps) {
  const style = LAYOUT_STYLES[layout];

  return (
    <section className={`relative py-16 sm:py-20 ${style.section}`}>
      {style.decor && <div className={`pointer-events-none absolute inset-0 ${style.decor}`} />}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              {number && (
                <span className="font-display hidden text-5xl font-bold leading-none text-white/[0.06] sm:block">
                  {number}
                </span>
              )}
              <div className="nw-section-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[var(--nw-card)]">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
                  {accent}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{subtitle}</p>
              </div>
            </div>
            {href && (
              <Link href={href} className="nw-link-arrow group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </ScrollReveal>

        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
