'use client';

import Link from 'next/link';
import { motion, type MotionValue } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface MissionBriefProps {
  style?: { x?: MotionValue<number>; y?: MotionValue<number> };
}

export default function MissionBrief({ style }: MissionBriefProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
      style={style}
      className="nw-mission-panel nw-mission-brief relative z-10 text-left lg:max-w-md"
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-400/90 sm:text-[10px]">
        NeuralWire Intelligence System
      </p>

      <h1 className="font-display text-[clamp(1.65rem,2.8vw+0.4rem,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
        Enter the
        <span className="block nw-mission-headline-accent">Intelligence Network</span>
      </h1>

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400 sm:text-[0.9375rem]">
        Track AI, startups, cybersecurity, engineering, and emerging technology through one
        living signal layer.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7">
        <Link href="/blogs" className="nw-hero-cta-primary nw-hero-cta-premium group text-sm">
          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
          Start Exploring
          <ArrowRight className="nw-hero-cta-arrow h-4 w-4" />
        </Link>
        <a href="#journey-latest" className="nw-hero-cta-ghost nw-hero-cta-ghost-premium text-sm">
          Latest Signals
        </a>
      </div>

      <dl className="mt-7 hidden gap-4 border-t border-white/[0.08] pt-5 sm:grid sm:grid-cols-2 lg:block lg:space-y-3">
        {[
          { k: 'Intel Count', v: '10,847' },
          { k: 'Active Signals', v: '2,847' },
        ].map((s) => (
          <div key={s.k}>
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{s.k}</dt>
            <dd className="font-display text-lg font-bold text-white">{s.v}</dd>
          </div>
        ))}
      </dl>
    </motion.aside>
  );
}
