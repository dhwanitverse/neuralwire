'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown, Cpu } from 'lucide-react';
import NeuralCommandCenter from '@/components/home/story/NeuralCommandCenter';
import { Parallax } from '@/components/home/story/Parallax';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const STATS = [
  { value: '10K+', label: 'Stories indexed' },
  { value: '6', label: 'Intelligence domains' },
  { value: 'Live', label: 'Signal coverage' },
];

export default function StoryHero() {
  return (
    <div className="nw-hero2 relative flex min-h-[calc(100dvh-var(--site-header-offset,96px))] items-center overflow-hidden">
      {/* ── Cinematic background ── */}
      <Parallax className="pointer-events-none absolute -inset-y-32 inset-x-0" distance={80}>
        <div className="nw-hero2-aurora nw-hero2-aurora-1" />
        <div className="nw-hero2-aurora nw-hero2-aurora-2" />
        <div className="nw-hero2-aurora nw-hero2-aurora-3" />
        <div className="nw-hero2-mesh" />
      </Parallax>
      <div className="nw-hero2-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="nw-hero2-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* ── Content ── */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left — message */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="nw-hero2-badge">
              <Cpu className="h-3.5 w-3.5 text-violet-300" />
              <span>AI Technology Intelligence Platform</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display mt-6 text-[2.7rem] font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl xl:text-[4.75rem]"
            >
              The Intelligence
              <span className="block">
                Layer of <span className="nw-hero-gradient">Tomorrow.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              NeuralWire tracks the future of AI, startups, cybersecurity, software
              engineering, and emerging technology in one premium intelligence platform.
            </motion.p>

            <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/blogs" className="nw-hero-cta-primary">
                <Sparkles className="h-4 w-4" />
                Explore Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#journey-latest" className="nw-hero-cta-ghost">
                View Latest Stories
              </a>
            </motion.div>

            <motion.div variants={item} className="mt-7">
              <span className="nw-hero2-chip">
                <span className="nw-hero2-live-dot" />
                Live AI Radar Online
              </span>
            </motion.div>

            <motion.dl variants={item} className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/[0.06] pt-7">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold tracking-tight text-white">{s.value}</dt>
                  <dd className="mt-0.5 text-xs uppercase tracking-[0.14em] text-slate-500">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right — AI command center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
            className="relative"
          >
            <Parallax distance={36} direction={-1}>
              <NeuralCommandCenter />
            </Parallax>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — guides toward the journey path */}
      <motion.a
        href="#journey-breaking"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors hover:text-white"
        aria-label="Scroll to begin the journey"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll to begin</span>
        <ChevronDown className="nw-scroll-hint h-5 w-5" />
      </motion.a>
    </div>
  );
}
