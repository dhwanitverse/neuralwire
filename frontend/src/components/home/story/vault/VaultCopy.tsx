'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LockOpen } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface VaultCopyProps {
  visible: boolean;
}

export default function VaultCopy({ visible }: VaultCopyProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative z-20 mx-auto mt-8 max-w-2xl px-4 text-center sm:mt-10"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-400/80 sm:text-xs">
        Every breakthrough begins as a signal.
      </p>

      <h1 className="font-display mt-3 text-[clamp(1.75rem,4vw+0.5rem,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
        Open The{' '}
        <span className="nw-vault-headline-accent">Intelligence Vault</span>
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
        The world&apos;s most important AI and technology signals, organized into one living
        intelligence network.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/blogs" className="nw-hero-cta-primary nw-hero-cta-premium group">
          <LockOpen className="h-4 w-4" />
          Open Vault
          <ArrowRight className="nw-hero-cta-arrow h-4 w-4" />
        </Link>
        <a href="#journey-breaking" className="nw-hero-cta-ghost nw-hero-cta-ghost-premium">
          View Live Signals
        </a>
      </div>

      <motion.a
        href="#journey-breaking"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 inline-flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-white"
        aria-label="Scroll — signal exits the vault into the journey network"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em]">
          Signal exits vault · scroll to enter network
        </span>
        <span className="nw-vault-scroll-beam" aria-hidden />
      </motion.a>
    </motion.div>
  );
}
