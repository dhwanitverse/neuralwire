'use client';

import { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useLightMotion } from '@/components/home/story/useLightMotion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NEURAL_LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1],
];

const NEURAL_NODES = [
  { x: 50, y: 50, r: 6 },
  { x: 22, y: 28, r: 3.5 },
  { x: 78, y: 24, r: 3 },
  { x: 88, y: 52, r: 3 },
  { x: 72, y: 78, r: 3.5 },
  { x: 28, y: 74, r: 3 },
];

const CORE_PARTICLES = [
  { left: '87.8%', top: '50%' },
  { left: '74.1%', top: '74.1%' },
  { left: '50%', top: '89.6%' },
  { left: '25.9%', top: '74.1%' },
  { left: '12.2%', top: '50%' },
  { left: '25.9%', top: '25.9%' },
  { left: '50%', top: '10.4%' },
  { left: '74.1%', top: '25.9%' },
  { left: '82.4%', top: '57.8%' },
  { left: '42.2%', top: '85.4%' },
  { left: '17.6%', top: '42.2%' },
  { left: '57.8%', top: '14.6%' },
] as const;

/** Precomputed endpoints — avoids SSR/client float drift on SVG attrs. */
const DATA_STREAMS = [
  { x2: 98, y2: 50 },
  { x2: 74, y2: 91.6 },
  { x2: 26, y2: 91.6 },
  { x2: 2, y2: 50 },
  { x2: 26, y2: 8.4 },
  { x2: 74, y2: 8.4 },
] as const;

export default function IntelligenceCore({ variant = 'default' }: { variant?: 'default' | 'mission' }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const light = useLightMotion();
  const reduced = useReducedMotion();
  const interactive = !light && !reduced && variant !== 'mission';

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 70, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring);
  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), spring);
  const glowY = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), spring);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
      my.set((e.clientY - (r.top + r.height / 2)) / r.height);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [interactive, mx, my]);

  const sizeClass =
    variant === 'mission'
      ? 'max-w-[min(88vw,300px)] sm:max-w-[280px] lg:max-w-[300px]'
      : 'max-w-[min(82vw,360px)] sm:max-w-[min(76vw,400px)] md:max-w-[min(70vw,420px)] lg:max-w-[min(64vw,440px)]';

  return (
    <div ref={wrapRef} className={`nw-core3-wrap relative mx-auto aspect-square w-full ${sizeClass}`}>
      {/* Depth glow pedestal */}
      <div className="nw-core3-pedestal pointer-events-none absolute inset-[-8%] z-0" aria-hidden />

      {/* Energy bloom — shifts with mouse */}
      <motion.div
        className="nw-core3-bloom pointer-events-none absolute inset-[-18%] z-0"
        style={interactive ? { x: glowX, y: glowY } : undefined}
        aria-hidden
      />

      {/* Signal waves */}
      <div className="nw-core3-waves pointer-events-none absolute inset-0" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="nw-core3-wave" style={{ ['--wave-i' as string]: i }} />
        ))}
      </div>

      <motion.div
        className="nw-core3 relative h-full w-full"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={
          interactive
            ? {
                rotateX,
                rotateY,
                transformPerspective: 1400,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
      >
        {/* Orbit rings */}
        <div className="nw-core3-ring nw-core3-ring-1" aria-hidden>
          <span className="nw-core3-orbit-dot" />
          <span className="nw-core3-orbit-dot nw-core3-orbit-dot-cyan" style={{ top: 'auto', bottom: '-3px' }} />
        </div>
        <div className="nw-core3-ring nw-core3-ring-2 nw-core3-ring-rev" aria-hidden>
          <span className="nw-core3-orbit-dot nw-core3-orbit-dot-blue" />
        </div>
        <div className="nw-core3-ring nw-core3-ring-3" aria-hidden>
          <span className="nw-core3-orbit-dot" style={{ background: '#818cf8', top: '50%', left: '-3px', marginLeft: 0, marginTop: '-3px' }} />
        </div>
        <div className="nw-core3-ring nw-core3-ring-4 nw-core3-ring-rev" aria-hidden />
        <div className="nw-core3-scan-ring" aria-hidden />

        {/* Radar sweep */}
        <div className="nw-core3-radar" aria-hidden />

        {/* Neural connections */}
        <svg className="nw-core3-neural absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="nw-core3-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nw-core3-link" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="32" fill="url(#nw-core3-glow)" className="nw-core3-pulse" />
          {NEURAL_LINKS.map(([a, b], i) => {
            const na = NEURAL_NODES[a];
            const nb = NEURAL_NODES[b];
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="url(#nw-core3-link)"
                strokeWidth="0.4"
                className="nw-core3-link"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            );
          })}
          {NEURAL_NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r / 2.5} fill="#22d3ee" className="nw-core3-node" style={{ animationDelay: `${i * 0.15}s` }} />
              {i === 0 && (
                <>
                  <circle cx={n.x} cy={n.y} r={n.r * 1.8} fill="none" stroke="#a78bfa" strokeWidth="0.3" strokeOpacity="0.5" className="nw-core3-pulse" />
                  <circle cx={n.x} cy={n.y} r={n.r * 0.6} fill="#fff" fillOpacity="0.9" />
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Data streams */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
          {DATA_STREAMS.map((pt, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={pt.x2}
              y2={pt.y2}
              stroke="rgba(34,211,238,0.35)"
              strokeWidth="0.25"
              className="nw-core3-stream"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </svg>

        {/* Arc reactor core */}
        <div className="nw-core3-reactor" aria-hidden>
          <div className="nw-core3-reactor-inner" />
          <div className="nw-core3-reactor-core" />
        </div>

        {/* Live particles */}
        <div className="nw-core3-particles pointer-events-none absolute inset-0" aria-hidden>
          {CORE_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="nw-core3-particle"
              style={{
                left: p.left,
                top: p.top,
                ['--p-i' as string]: i,
              }}
            />
          ))}
        </div>
      </motion.div>

      {variant !== 'mission' && (
        <div className="pointer-events-none absolute bottom-[-6%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-violet-300/80">
            Intelligence Core
          </span>
        </div>
      )}
    </div>
  );
}
