'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Rocket, ShieldAlert, Code2 } from 'lucide-react';
import IntelligenceMap from '@/components/home/IntelligenceMap';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Panel = {
  label: string;
  value: string;
  meta: string;
  icon: typeof Zap;
  accent: string;
  ring: string;
  position: string;
  float: number;
  delay: number;
};

const PANELS: Panel[] = [
  {
    label: 'Breaking AI Signal',
    value: 'Frontier model update',
    meta: 'live · 2m ago',
    icon: Zap,
    accent: 'text-rose-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(244,63,94,0.7)]',
    position: 'left-0 top-2 sm:-left-6 lg:-left-10',
    float: -10,
    delay: 0,
  },
  {
    label: 'Cyber Alert',
    value: 'Zero-day patched',
    meta: 'severity · high',
    icon: ShieldAlert,
    accent: 'text-amber-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(245,158,11,0.7)]',
    position: 'right-0 top-10 sm:-right-6 lg:-right-12',
    float: 12,
    delay: 0.6,
  },
  {
    label: 'Startup Watch',
    value: '$120M Series B',
    meta: 'AI infra',
    icon: Rocket,
    accent: 'text-cyan-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(34,211,238,0.7)]',
    position: 'right-2 bottom-6 sm:-right-4 lg:-right-10',
    float: -12,
    delay: 1.2,
  },
  {
    label: 'Developer Pulse',
    value: 'Build trending',
    meta: '+38% commits',
    icon: Code2,
    accent: 'text-violet-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(139,92,246,0.7)]',
    position: 'left-0 bottom-2 sm:-left-5 lg:-left-12',
    float: 10,
    delay: 1.8,
  },
];

export default function NeuralCommandCenter() {
  const reduced = useReducedMotion();

  return (
    <div className="nw-cc-wrap relative mx-auto w-full max-w-[440px] sm:max-w-[520px]">
      {/* Concentric data-stream rings + radar + orb */}
      <div className="nw-cc relative aspect-square">
        <div className="nw-cc-ring nw-cc-ring-spin" aria-hidden>
          <span className="nw-cc-ring-node" />
        </div>
        <div className="nw-cc-ring nw-cc-ring-2 nw-cc-ring-spin-rev" aria-hidden>
          <span className="nw-cc-ring-node nw-cc-ring-node-cyan" />
        </div>
        <div className="nw-cc-ring nw-cc-ring-3 nw-cc-ring-spin" aria-hidden />

        <div className="nw-cc-radar" aria-hidden />
        <div className="nw-cc-orb" aria-hidden />

        {/* Knowledge graph core */}
        <div className="absolute inset-[15%] flex items-center justify-center">
          <IntelligenceMap compact bare />
        </div>
      </div>

      {/* Floating intelligence panels */}
      {PANELS.map((p) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 + p.delay * 0.25 }}
            className={`nw-cc-panel absolute hidden md:flex ${p.position} ${p.ring}`}
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, p.float, 0] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 7 + p.delay, repeat: Infinity, ease: 'easeInOut', delay: p.delay }
              }
              className="flex items-center gap-2.5"
            >
              <span className={`nw-cc-panel-icon ${p.accent}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {p.label}
                </span>
                <span className="block truncate text-[13px] font-semibold text-white">
                  {p.value}
                </span>
                <span className="block text-[10px] font-medium text-slate-500">{p.meta}</span>
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
