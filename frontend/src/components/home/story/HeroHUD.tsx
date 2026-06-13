'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Zap, ShieldAlert, Rocket, Code2, Wifi } from 'lucide-react';
import { Parallax } from '@/components/home/story/Parallax';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HUD_STATS = [
  { label: 'Intelligence Count', value: '10,847', unit: 'live' },
  { label: 'Active Signals', value: '2,847', unit: 'now' },
  { label: 'Data Processed', value: '847', unit: 'TB' },
  { label: 'Network', value: 'Online', unit: '●' },
];

/** Side + lower arc — stays clear of headline above the core stage. */
const HUD_CARDS = [
  {
    tag: 'AI Signal',
    title: 'Claude 5 Released',
    icon: Zap,
    accent: 'text-rose-300',
    ring: 'rgba(244,63,94,0.5)',
    left: '6%',
    top: '58%',
    slideX: -16,
    parallax: 10,
    delay: 0,
  },
  {
    tag: 'Cyber Alert',
    title: 'Critical Patch Live',
    icon: ShieldAlert,
    accent: 'text-amber-300',
    ring: 'rgba(245,158,11,0.5)',
    left: '18%',
    top: '82%',
    slideX: -12,
    parallax: -8,
    delay: 0.12,
  },
  {
    tag: 'Startup Watch',
    title: 'Series B Funding',
    icon: Rocket,
    accent: 'text-cyan-300',
    ring: 'rgba(34,211,238,0.5)',
    left: '50%',
    top: '88%',
    slideX: 0,
    parallax: 12,
    delay: 0.24,
  },
  {
    tag: 'Developer Pulse',
    title: 'Rust Adoption Rising',
    icon: Code2,
    accent: 'text-indigo-300',
    ring: 'rgba(99,102,241,0.5)',
    left: '82%',
    top: '82%',
    slideX: 12,
    parallax: -10,
    delay: 0.36,
  },
  {
    tag: 'Network Online',
    title: 'All Nodes Active',
    icon: Wifi,
    accent: 'text-emerald-300',
    ring: 'rgba(52,211,153,0.5)',
    left: '94%',
    top: '58%',
    slideX: 16,
    parallax: 8,
    delay: 0.48,
  },
] as const;

export function HeroHUDStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
      className="nw-hud3-stats-row mb-3 hidden w-full sm:mb-4 sm:block"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 lg:gap-6">
        {HUD_STATS.slice(0, 2).map((s) => (
          <div key={s.label} className="nw-hud3-stat">
            <span className="nw-hud3-stat-label">{s.label}</span>
            <span className="nw-hud3-stat-value">
              {s.value}
              <span className="nw-hud3-stat-unit">{s.unit}</span>
            </span>
          </div>
        ))}
        <div className="hidden items-center gap-6 lg:flex">
          {HUD_STATS.slice(2).map((s) => (
            <div key={s.label} className="nw-hud3-stat">
              <span className="nw-hud3-stat-label">{s.label}</span>
              <span className="nw-hud3-stat-value">
                {s.value}
                <span className="nw-hud3-stat-unit">{s.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroHUDCards() {
  const reduced = useReducedMotion();

  return (
    <div className="nw-hud3-cards pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden>
      {HUD_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.tag}
            initial={{ opacity: 0, y: 18, x: card.slideX }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.55 + card.delay, duration: 0.65, ease: EASE }}
            className="nw-hud3-card absolute"
            style={{
              left: card.left,
              top: card.top,
              transform: 'translate(-50%, -50%)',
              ['--hud-ring' as string]: card.ring,
            }}
          >
            <Parallax distance={card.parallax} direction={card.parallax > 0 ? 1 : -1}>
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { y: [0, card.slideX > 0 ? 4 : -4, 0] }
                }
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 5.5 + card.delay * 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: card.delay,
                      }
                }
                className="flex items-start gap-2"
              >
                <span className={`nw-hud3-card-icon ${card.accent}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="nw-hud3-card-text min-w-0">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {card.tag}
                  </span>
                  <span className="block text-[11px] font-semibold leading-snug text-white">
                    {card.title}
                  </span>
                </span>
              </motion.div>
            </Parallax>
          </motion.div>
        );
      })}
    </div>
  );
}
