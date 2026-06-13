'use client';

import { Parallax } from '@/components/home/story/Parallax';
import { useLightMotion } from '@/components/home/story/useLightMotion';

/** Precomputed star positions — no runtime randomness, GPU-friendly. */
const STARS = [
  [12, 18], [28, 42], [45, 8], [62, 31], [78, 55], [88, 12], [15, 72], [35, 88],
  [55, 65], [72, 78], [92, 45], [8, 52], [48, 22], [68, 38], [82, 82], [22, 28],
  [58, 48], [38, 58], [95, 68], [5, 35],
] as const;

const GLOW_PARTICLES = [
  { x: '18%', y: '22%', size: 120, color: 'rgba(59,130,246,0.35)', delay: 0 },
  { x: '72%', y: '18%', size: 90, color: 'rgba(139,92,246,0.3)', delay: 2 },
  { x: '85%', y: '62%', size: 70, color: 'rgba(34,211,238,0.25)', delay: 4 },
  { x: '12%', y: '68%', size: 80, color: 'rgba(99,102,241,0.28)', delay: 1 },
  { x: '50%', y: '78%', size: 100, color: 'rgba(139,92,246,0.2)', delay: 3 },
  { x: '38%', y: '12%', size: 60, color: 'rgba(34,211,238,0.22)', delay: 5 },
] as const;

export default function HeroCinematicBackground({ variant = 'default' }: { variant?: 'default' | 'core' }) {
  const light = useLightMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Depth layer — deep base */}
      <div className={`absolute inset-0 ${variant === 'core' ? 'nw-hero3-depth' : 'nw-hero2-depth'}`} />

      {/* Layer 3: Energy fog (Hero 3) */}
      {variant === 'core' && (
        <>
          <div className="nw-hero3-fog nw-hero3-fog-blue" />
          <div className="nw-hero3-fog nw-hero3-fog-violet" />
          <div className="nw-hero3-fog nw-hero3-fog-cyan" />
          <div className="nw-hero3-aurora-band" />
        </>
      )}

      {/* Aurora + mesh (parallax) */}
      <Parallax className="absolute -inset-y-20 inset-x-0" distance={light ? 0 : 55}>
        <div className="nw-hero2-aurora nw-hero2-aurora-1" />
        <div className="nw-hero2-aurora nw-hero2-aurora-2" />
        <div className="nw-hero2-aurora nw-hero2-aurora-3" />
        <div className="nw-hero2-mesh" />
        <div className="nw-hero2-grid-lines" />
      </Parallax>

      {/* Star field */}
      <div className="nw-hero2-stars absolute inset-0">
        {STARS.map(([left, top], i) => (
          <span
            key={i}
            className="nw-hero2-star"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              ['--star-delay' as string]: `${i * 0.35}s`,
              ['--star-size' as string]: i % 3 === 0 ? '2px' : '1px',
            }}
          />
        ))}
      </div>

      {/* Soft glow particles */}
      {!light && (
        <div className="nw-hero2-particles absolute inset-0">
          {GLOW_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="nw-hero2-glow-particle"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
                ['--particle-delay' as string]: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="nw-hero2-noise absolute inset-0" />
      <div className="nw-hero2-vignette absolute inset-0" />
    </div>
  );
}
