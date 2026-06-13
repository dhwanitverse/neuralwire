'use client';

import { useEffect, useRef } from 'react';

const NODES = [
  { id: 'ai', label: 'AI', x: 50, y: 42, r: 28, color: '#8b5cf6' },
  { id: 'llm', label: 'LLMs', x: 22, y: 28, r: 18, color: '#3b82f6' },
  { id: 'robot', label: 'Robotics', x: 78, y: 26, r: 16, color: '#22d3ee' },
  { id: 'chip', label: 'Chips', x: 82, y: 58, r: 15, color: '#6366f1' },
  { id: 'sec', label: 'Security', x: 18, y: 62, r: 15, color: '#f43f5e' },
  { id: 'cloud', label: 'Cloud', x: 38, y: 72, r: 14, color: '#0ea5e9' },
  { id: 'bio', label: 'Bio', x: 64, y: 74, r: 13, color: '#a78bfa' },
];

const LINKS: [string, string][] = [
  ['ai', 'llm'], ['ai', 'robot'], ['ai', 'chip'], ['ai', 'sec'],
  ['ai', 'cloud'], ['ai', 'bio'], ['llm', 'sec'], ['chip', 'cloud'],
];

export default function IntelligenceMap({ compact = false }: { compact?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        raf = 0;
      });
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div
      className={`relative flex h-full items-center justify-center ${
        compact ? 'min-h-[240px]' : 'min-h-[420px] lg:min-h-[520px]'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_65%)]" />
      <div
        ref={wrapRef}
        className={`nw-intel-map relative aspect-square w-full transition-transform duration-200 ease-out ${
          compact ? 'max-w-[320px]' : 'max-w-[480px]'
        }`}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="nw-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nw-link-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="38" fill="url(#nw-hub-glow)" className="nw-intel-pulse" />

          {LINKS.map(([a, b], i) => {
            const na = nodeById[a];
            const nb = nodeById[b];
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="url(#nw-link-grad)"
                strokeWidth="0.35"
                className="nw-intel-link"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}

          {NODES.map((n, i) => (
            <g key={n.id} className="nw-intel-node" style={{ animationDelay: `${i * 0.1}s` }}>
              <circle cx={n.x} cy={n.y} r={n.r / 10} fill={n.color} fillOpacity="0.15" stroke={n.color} strokeWidth="0.4" strokeOpacity="0.6" />
              <circle cx={n.x} cy={n.y} r={n.r / 22} fill={n.color} />
              <text x={n.x} y={n.y + n.r / 5 + 2} textAnchor="middle" fill="#94a3b8" fontSize="2.8" fontWeight="600">
                {n.label}
              </text>
            </g>
          ))}

          <g>
            <circle cx="50" cy="50" r="8" fill="#050816" stroke="url(#nw-link-grad)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="3" fill="#8b5cf6" className="nw-intel-pulse" />
            <text x="50" y="62" textAnchor="middle" fill="#e2e8f0" fontSize="3" fontWeight="700" letterSpacing="0.5">
              NEURALWIRE
            </text>
          </g>
        </svg>

        <div className="nw-intel-stat absolute left-4 top-4 rounded-xl border border-white/[0.08] bg-[rgba(11,17,32,0.8)] px-3 py-2 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Live signals</p>
          <p className="font-display text-lg font-bold text-white">2,847</p>
        </div>
        <div className="nw-intel-stat absolute bottom-6 right-2 rounded-xl border border-white/[0.08] bg-[rgba(11,17,32,0.8)] px-3 py-2 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">AI coverage</p>
          <p className="font-display text-lg font-bold text-white">24/7</p>
        </div>
      </div>
    </div>
  );
}
