'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function JourneyPortal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
      className="relative z-20 mx-auto mt-6 flex w-full max-w-md flex-col items-center sm:mt-8"
    >
      <a
        href="#journey-breaking"
        className="nw-mission-portal group flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-white"
        aria-label="Scroll to enter the intelligence journey"
      >
        <span className="nw-mission-portal-ring" aria-hidden>
          <span className="nw-mission-portal-core" />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-400/90 group-hover:text-cyan-300 sm:text-[10px]">
          Enter Journey Portal
        </span>
        <span className="text-center text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
          Scroll to sync with the network path
        </span>
        <ChevronDown className="nw-scroll-hint h-4 w-4 text-violet-400/80" />
      </a>
    </motion.div>
  );
}
