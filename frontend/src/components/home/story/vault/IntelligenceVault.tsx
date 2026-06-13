'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type MotionValue } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Precomputed — stable SSR/hydration */
const DOMAINS = [
  { id: 'ai', label: 'AI', x: 50, y: 18, color: '#8b5cf6' },
  { id: 'cyber', label: 'Cybersecurity', x: 82, y: 32, color: '#ef4444' },
  { id: 'startups', label: 'Startups', x: 88, y: 58, color: '#f59e0b' },
  { id: 'robotics', label: 'Robotics', x: 68, y: 78, color: '#22d3ee' },
  { id: 'chips', label: 'Chips', x: 32, y: 78, color: '#3b82f6' },
  { id: 'quantum', label: 'Quantum', x: 12, y: 58, color: '#a855f7' },
  { id: 'cloud', label: 'Cloud', x: 18, y: 32, color: '#06b6d4' },
] as const;

const SIGNALS = [
  {
    tag: 'CLASSIFIED SIGNAL',
    title: 'Claude 5 Released',
    left: '4%',
    top: '32%',
    delay: 0.2,
    accent: 'cyan',
  },
  {
    tag: 'TOP SECRET',
    title: 'Nvidia Blackwell Update',
    left: '62%',
    top: '22%',
    delay: 0.45,
    accent: 'violet',
  },
  {
    tag: 'PRIORITY ALERT',
    title: 'Critical Security Patch',
    left: '68%',
    top: '58%',
    delay: 0.65,
    accent: 'red',
  },
  {
    tag: 'TRENDING',
    title: 'AI Startup Raises $500M',
    left: '2%',
    top: '62%',
    delay: 0.85,
    accent: 'amber',
  },
] as const;

const BOLTS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  return {
    left: 50 + 38 * Math.cos(angle),
    top: 50 + 38 * Math.sin(angle),
    delay: i * 0.05,
  };
});

type VaultPhase = 'accessing' | 'unlocking' | 'opening' | 'revealed';

interface IntelligenceVaultProps {
  innerX: MotionValue<number>;
  innerY: MotionValue<number>;
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  sceneRotateX: MotionValue<number>;
  sceneRotateY: MotionValue<number>;
  onRevealed?: () => void;
}

export default function IntelligenceVault({
  innerX,
  innerY,
  glowX,
  glowY,
  sceneRotateX,
  sceneRotateY,
  onRevealed,
}: IntelligenceVaultProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<VaultPhase>(reduced ? 'revealed' : 'accessing');

  useEffect(() => {
    if (reduced) {
      onRevealed?.();
      return;
    }
    const t1 = window.setTimeout(() => setPhase('unlocking'), 1400);
    const t2 = window.setTimeout(() => setPhase('opening'), 2400);
    const t3 = window.setTimeout(() => {
      setPhase('revealed');
      onRevealed?.();
    }, 4200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [reduced, onRevealed]);

  const doorOpen = phase === 'opening' || phase === 'revealed';
  const showInterior = phase === 'opening' || phase === 'revealed';

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,420px)] sm:max-w-[380px] lg:max-w-[420px]">
      {/* Unlock overlay */}
      {phase !== 'revealed' && (
        <motion.div
          className="nw-vault-access-overlay pointer-events-none absolute inset-0 z-40 flex items-center justify-center rounded-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'opening' ? 0 : 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <div className="text-center">
            <motion.p
              className="font-display text-[10px] font-semibold uppercase tracking-[0.45em] text-cyan-300/90 sm:text-xs"
              animate={
                phase === 'accessing'
                  ? { opacity: [0.4, 1, 0.4], letterSpacing: ['0.38em', '0.48em', '0.38em'] }
                  : { opacity: 1 }
              }
              transition={{ duration: 1.4, repeat: phase === 'accessing' ? Infinity : 0 }}
            >
              Accessing the future
            </motion.p>
            {phase === 'unlocking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex justify-center gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1 w-1 rounded-full bg-cyan-400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Vault scene */}
      <motion.div
        className="nw-vault-scene relative aspect-square w-full"
        style={{ perspective: '1200px', rotateX: sceneRotateX, rotateY: sceneRotateY }}
      >
        {/* Mouse-reactive glow */}
        <motion.div
          className="nw-vault-mouse-glow pointer-events-none absolute inset-[-12%] z-0 rounded-full"
          style={{ x: glowX, y: glowY }}
          aria-hidden
        />

        {/* Interior universe (behind door) */}
        <motion.div
          className="nw-vault-interior absolute inset-[8%] overflow-hidden rounded-full"
          style={{ x: innerX, y: innerY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: showInterior ? 1 : 0,
            scale: showInterior ? 1 : 0.85,
          }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <div className="nw-vault-universe absolute inset-0" />
          <div className="nw-vault-radar absolute inset-0" aria-hidden />
          <div className="nw-vault-holo absolute inset-0" aria-hidden />

          {/* Domain network */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <radialGradient id="nw-vault-hub-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
              </radialGradient>
            </defs>
            {DOMAINS.map((d) => (
              <line
                key={`line-${d.id}`}
                x1="50"
                y1="50"
                x2={d.x}
                y2={d.y}
                className="nw-vault-network-line"
              />
            ))}
            <circle cx="50" cy="50" r="18" fill="url(#nw-vault-hub-glow)" />
            <circle cx="50" cy="50" r="6" className="nw-vault-hub-core" />
            {DOMAINS.map((d) => (
              <g key={d.id}>
                <circle cx={d.x} cy={d.y} r="4.5" fill={d.color} className="nw-vault-node-dot" />
                <circle cx={d.x} cy={d.y} r="8" fill="none" stroke={d.color} strokeWidth="0.3" opacity="0.5" />
              </g>
            ))}
          </svg>

          {/* Domain labels */}
          <div className="absolute inset-0" aria-hidden>
            {DOMAINS.map((d) => (
              <span
                key={`lbl-${d.id}`}
                className="nw-vault-domain-label absolute -translate-x-1/2 -translate-y-1/2 text-[7px] font-semibold uppercase tracking-wider sm:text-[8px]"
                style={{ left: `${d.x}%`, top: `${d.y + (d.y > 50 ? 8 : -8)}%`, color: d.color }}
              >
                {d.label}
              </span>
            ))}
          </div>

          {/* Floating signal cards */}
          {SIGNALS.map((s) => (
            <motion.div
              key={s.tag}
              className={`nw-vault-signal-card nw-vault-signal-${s.accent} absolute hidden max-w-[140px] sm:block`}
              style={{ left: s.left, top: s.top }}
              initial={{ opacity: 0, y: 8 }}
              animate={
                showInterior
                  ? { opacity: 1, y: [0, -4, 0] }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                opacity: { duration: 0.6, delay: s.delay },
                y: { duration: 4 + s.delay, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
              }}
            >
              <span className="nw-vault-signal-tag">{s.tag}</span>
              <span className="nw-vault-signal-title">{s.title}</span>
            </motion.div>
          ))}

          {/* Signal particles */}
          <div className="nw-vault-particles absolute inset-0" aria-hidden />
        </motion.div>

        {/* Vault door */}
        <motion.div
          className="nw-vault-door-wrap absolute inset-0 z-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="nw-vault-door absolute inset-0 rounded-full"
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: doorOpen ? -108 : 0 }}
            transition={{ duration: reduced ? 0 : 1.8, ease: EASE, delay: phase === 'opening' ? 0 : 0 }}
          >
            {/* Door face */}
            <div className="nw-vault-door-face absolute inset-0 rounded-full">
              <div className="nw-vault-door-ring absolute inset-[6%] rounded-full" />
              <div className="nw-vault-door-ring absolute inset-[14%] rounded-full opacity-60" />
              <div className="nw-vault-door-ring absolute inset-[22%] rounded-full opacity-40" />

              {/* Bolts */}
              {BOLTS.map((b, i) => (
                <span
                  key={i}
                  className={`nw-vault-bolt absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-2.5 sm:w-2.5 ${
                    phase === 'unlocking' ? 'nw-vault-bolt-unlock' : ''
                  }`}
                  style={{ left: `${b.left}%`, top: `${b.top}%`, animationDelay: `${b.delay}s` }}
                />
              ))}

              {/* Dial / handle */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: phase === 'unlocking' ? 360 : phase === 'opening' ? 540 : 0 }}
                transition={{
                  duration: phase === 'unlocking' ? 1 : phase === 'opening' ? 0.8 : 0,
                  ease: EASE,
                }}
              >
                <div className="nw-vault-dial absolute inset-0 rounded-full" />
                <div className="nw-vault-dial-spoke absolute left-1/2 top-[12%] h-[38%] w-[3px] -translate-x-1/2 rounded-full bg-cyan-400/80" />
                <div className="nw-vault-dial-spoke absolute left-1/2 top-1/2 h-[3px] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/60" />
              </motion.div>

              {/* Glass reflection */}
              <div className="nw-vault-door-glass absolute inset-[28%] rounded-full" aria-hidden />
            </div>

            {/* Door edge (3D thickness) */}
            <div className="nw-vault-door-edge absolute inset-y-[8%] -right-2 w-4 rounded-r-full" aria-hidden />
          </motion.div>
        </motion.div>

        {/* Outer vault frame */}
        <div className="nw-vault-frame pointer-events-none absolute inset-[-3%] rounded-full" aria-hidden />

        {/* Energy pulse on unlock */}
        {(phase === 'unlocking' || phase === 'opening') && (
          <motion.div
            className="nw-vault-energy-pulse pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.9, 1.08, 1.15] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            aria-hidden
          />
        )}
      </motion.div>

      {/* Exit signal — connects to journey on scroll */}
      <div
        data-vault-signal-origin
        className="nw-vault-signal-origin pointer-events-none absolute bottom-[-4%] left-1/2 z-20 -translate-x-1/2"
        aria-hidden
      >
        <motion.span
          className="nw-vault-exit-signal block"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            phase === 'revealed'
              ? { opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }
              : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
