'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const KEYWORDS = [
  'AI',
  'Cybersecurity',
  'Robotics',
  'Startups',
  'Quantum',
  'Cloud',
  'Engineering',
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function RotatingKeyword() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % KEYWORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, [reduced]);

  const word = KEYWORDS[index];

  return (
    <div className="nw-kw3 mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-sm sm:text-base">
      <span className="font-medium text-slate-500">Tracking</span>
      <span className="relative inline-flex h-[1.4em] min-w-[9rem] items-center overflow-hidden sm:min-w-[11rem]">
        {reduced ? (
          <span className="font-display font-semibold text-cyan-300">Intelligence</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="nw-kw3-word absolute left-0 font-display text-base font-semibold sm:text-lg"
            >
              {word}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </div>
  );
}
