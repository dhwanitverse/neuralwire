'use client';

import Link from 'next/link';
import { Blog } from '@/types';
import { formatDate } from '@/lib/utils';

interface IntelligenceTimelineProps {
  items: Blog[];
  loading?: boolean;
}

export default function IntelligenceTimeline({ items, loading }: IntelligenceTimelineProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-cyan-400/50" aria-hidden />
      <ul className="space-y-6">
        {items.slice(0, 5).map((item, i) => (
          <li key={item._id} className="relative">
            <div
              className="absolute -left-8 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-violet-500/40 bg-[var(--nw-surface)] text-[10px] font-bold text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
            >
              {i + 1}
            </div>
            <Link
              href={`/blogs/${item._id}`}
              className="nw-surface-card block rounded-xl border border-white/[0.06] p-4 transition-colors hover:border-violet-500/25 hover:bg-white/[0.03]"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{formatDate(item.createdAt)}</p>
              <p className="font-display mt-1 font-semibold text-white hover:text-violet-200">{item.title}</p>
              <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.category}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
