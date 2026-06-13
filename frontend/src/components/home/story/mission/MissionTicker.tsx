'use client';

import { motion } from 'framer-motion';

const TICKER_ITEMS = [
  'OpenAI frontier model signal detected',
  'Cyber breach patch verified · severity high',
  'Series B funding · AI infrastructure',
  'Rust adoption +38% · developer pulse',
  'Gemini research update · model sync',
  'Neural network online · 2,847 active signals',
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MissionTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="nw-mission-ticker mb-5 w-full shrink-0 sm:mb-6"
      aria-label="Live intelligence ticker"
    >
      <div className="flex items-center gap-3 border border-cyan-500/20 bg-[rgba(6,12,28,0.75)] px-3 py-2 backdrop-blur-md sm:px-4">
        <span className="flex shrink-0 items-center gap-1.5 border-r border-white/10 pr-3">
          <span className="nw-mission-live-dot" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-[10px]">
            Live Feed
          </span>
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="nw-mission-ticker-track">
            {doubled.map((item, i) => (
              <span key={`${item}-${i}`} className="nw-mission-ticker-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
