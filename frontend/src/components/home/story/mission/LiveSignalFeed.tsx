'use client';

import { motion, type MotionValue } from 'framer-motion';
import { Zap, ShieldAlert, Rocket, Code2, Brain } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEED = [
  { tag: 'AI Signal', value: 'Claude 5 frontier release', icon: Zap, status: 'live', color: 'rose' },
  { tag: 'Cyber Alert', value: 'Zero-day patch deployed', icon: ShieldAlert, status: 'high', color: 'amber' },
  { tag: 'Startup Watch', value: '$120M Series B · AI infra', icon: Rocket, status: 'hot', color: 'cyan' },
  { tag: 'Developer Pulse', value: 'Rust adoption surging', icon: Code2, status: 'up', color: 'violet' },
  { tag: 'Model Update', value: 'OpenAI research sync', icon: Brain, status: 'sync', color: 'blue' },
] as const;

interface LiveSignalFeedProps {
  style?: { x?: MotionValue<number>; y?: MotionValue<number> };
}

export default function LiveSignalFeed({ style }: LiveSignalFeedProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, ease: EASE, delay: 0.25 }}
      style={style}
      className="nw-mission-panel nw-mission-feed relative z-10 w-full lg:max-w-[280px] lg:justify-self-end"
    >
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-300">
          Signal Monitor
        </span>
        <span className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-400">
          <span className="nw-mission-live-dot scale-75" />
          LIVE
        </span>
      </div>

      <ul className="space-y-2">
        {FEED.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.tag}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.55, ease: EASE }}
              className={`nw-mission-feed-item nw-mission-feed-${item.color}`}
            >
              <span className={`nw-mission-feed-icon nw-mission-icon-${item.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {item.tag}
                  </span>
                  <span className={`nw-mission-status nw-mission-status-${item.color}`}>
                    {item.status}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-medium text-slate-200">
                  {item.value}
                </span>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.aside>
  );
}
