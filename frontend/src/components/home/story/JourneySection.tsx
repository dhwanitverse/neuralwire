'use client';

import { ReactNode } from 'react';

interface JourneySectionProps {
  step: number;
  id: string;
  children: ReactNode;
  className?: string;
  glow?: 'blue' | 'violet' | 'cyan' | 'red' | 'amber' | 'none';
  isFirst?: boolean;
  isLast?: boolean;
  compact?: boolean;
}

const GLOW: Record<string, string> = {
  blue: 'from-blue-500/10 via-transparent to-transparent',
  violet: 'from-violet-500/12 via-transparent to-transparent',
  cyan: 'from-cyan-500/10 via-transparent to-transparent',
  red: 'from-red-500/8 via-transparent to-transparent',
  amber: 'from-amber-500/8 via-transparent to-transparent',
  none: '',
};

export default function JourneySection({
  step,
  id,
  children,
  className = '',
  glow = 'violet',
  compact = false,
}: JourneySectionProps) {
  return (
    <section
      id={id}
      data-journey-step={step}
      data-journey-state="future"
      className={`nw-journey-section relative ${className}`}
    >
      <div
        data-journey-anchor
        className={`pointer-events-none absolute left-0 w-px ${compact ? 'top-[42%]' : 'top-28 sm:top-32'}`}
        aria-hidden
      />

      {glow !== 'none' && (
        <div className="nw-section-ambient pointer-events-none absolute inset-0" aria-hidden>
          <div className={`absolute inset-0 bg-gradient-to-b ${GLOW[glow]}`} />
          <div className="nw-section-active-glow absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.09),transparent_65%)]" />
        </div>
      )}

      <div
        className={`relative z-[1] mx-auto max-w-7xl ${
          compact
            ? 'px-4 py-0 sm:px-6 lg:px-8'
            : 'px-4 py-16 pl-12 sm:px-6 sm:py-24 sm:pl-6 lg:px-8 lg:pl-16 xl:pl-24'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
