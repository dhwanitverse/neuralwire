'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Rocket, ShieldAlert, Code2 } from 'lucide-react';
import IntelligenceMap from '@/components/home/IntelligenceMap';
import { Parallax } from '@/components/home/story/Parallax';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ORBIT_LABELS = [
  { text: 'AI Models', angle: -55, color: '#a78bfa' },
  { text: 'Cyber Risk', angle: -5, color: '#fbbf24' },
  { text: 'Startup Signal', angle: 48, color: '#22d3ee' },
  { text: 'Dev Trends', angle: 125, color: '#818cf8' },
  { text: 'Chip Market', angle: 195, color: '#60a5fa' },
] as const;

const STREAM_ANGLES = [0, 72, 144, 216, 288];

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
  parallax: number;
};

const PANELS: Panel[] = [
  {
    label: 'Breaking AI Signal',
    value: 'Frontier model update',
    meta: 'live · 2m ago',
    icon: Zap,
    accent: 'text-rose-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(244,63,94,0.7)]',
    position: 'left-1 top-2 lg:left-0',
    float: -8,
    delay: 0,
    parallax: 12,
  },
  {
    label: 'Cyber Alert',
    value: 'Zero-day patched',
    meta: 'severity · high',
    icon: ShieldAlert,
    accent: 'text-amber-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(245,158,11,0.7)]',
    position: 'right-1 top-6 lg:right-0',
    float: 10,
    delay: 0.6,
    parallax: -10,
  },
  {
    label: 'Startup Watch',
    value: '$120M Series B',
    meta: 'AI infra',
    icon: Rocket,
    accent: 'text-cyan-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(34,211,238,0.7)]',
    position: 'right-1 bottom-10 lg:right-0',
    float: -9,
    delay: 1.2,
    parallax: 14,
  },
  {
    label: 'Developer Pulse',
    value: 'Build trending',
    meta: '+38% commits',
    icon: Code2,
    accent: 'text-violet-300',
    ring: 'shadow-[0_0_30px_-12px_rgba(139,92,246,0.7)]',
    position: 'left-1 bottom-6 lg:left-0',
    float: 8,
    delay: 1.8,
    parallax: -12,
  },
];

function labelPosition(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + Math.cos(rad) * radiusPct}%`,
    top: `${50 + Math.sin(rad) * radiusPct}%`,
  };
}

export default function NeuralCommandCenter() {
  const reduced = useReducedMotion();

  return (
    <div className="nw-cc-wrap relative mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[500px]">
      <div className="nw-cc relative aspect-square">
        {/* Data stream lines */}
        <svg
          className="nw-cc-streams pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <linearGradient id="nw-stream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {STREAM_ANGLES.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = 50 + Math.cos(rad) * 46;
            const y2 = 50 + Math.sin(rad) * 46;
            return (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="url(#nw-stream-grad)"
                strokeWidth="0.35"
                className="nw-cc-stream-line"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            );
          })}
        </svg>

        {/* Orbit rings */}
        <div className="nw-cc-ring nw-cc-ring-spin" aria-hidden>
          <span className="nw-cc-ring-node nw-cc-pulse-node" />
          <span className="nw-cc-ring-node nw-cc-pulse-node nw-cc-ring-node-bl" style={{ top: 'auto', bottom: '-4px' }} />
        </div>
        <div className="nw-cc-ring nw-cc-ring-2 nw-cc-ring-spin-rev" aria-hidden>
          <span className="nw-cc-ring-node nw-cc-ring-node-cyan nw-cc-pulse-node" />
          <span
            className="nw-cc-ring-node nw-cc-ring-node-cyan nw-cc-pulse-node"
            style={{ top: '50%', left: '-4px', marginLeft: 0, marginTop: '-4px' }}
          />
        </div>
        <div className="nw-cc-ring nw-cc-ring-3 nw-cc-ring-spin" aria-hidden>
          <span className="nw-cc-ring-node nw-cc-pulse-node" style={{ background: '#818cf8' }} />
        </div>
        <div className="nw-cc-ring nw-cc-ring-4 nw-cc-ring-spin-rev" aria-hidden />

        <div className="nw-cc-radar" aria-hidden />
        <div className="nw-cc-orb" aria-hidden />
        <div className="nw-cc-orb-core" aria-hidden />

        {/* Knowledge graph */}
        <div className="absolute inset-[15%] flex items-center justify-center">
          <IntelligenceMap compact bare />
        </div>

        {/* Orbiting domain labels */}
        {ORBIT_LABELS.map((lbl, i) => {
          const pos = labelPosition(lbl.angle, 46);
          return (
            <motion.span
              key={lbl.text}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: EASE }}
              className="nw-cc-orbit-label absolute hidden sm:inline-flex"
              style={{
                left: pos.left,
                top: pos.top,
                transform: 'translate(-50%, -50%)',
                ['--label-color' as string]: lbl.color,
              }}
            >
              <motion.span
                animate={reduced ? undefined : { y: [0, i % 2 === 0 ? -4 : 4, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
                }
              >
                {lbl.text}
              </motion.span>
            </motion.span>
          );
        })}
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
            <Parallax distance={p.parallax} direction={p.parallax > 0 ? 1 : -1}>
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
                  <span className="block truncate text-[13px] font-semibold text-white">{p.value}</span>
                  <span className="block text-[10px] font-medium text-slate-500">{p.meta}</span>
                </span>
              </motion.div>
            </Parallax>
          </motion.div>
        );
      })}
    </div>
  );
}
