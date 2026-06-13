'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { cachedGet } from '@/lib/fetchCache';
import { Blog } from '@/types';

interface BreakingNewsTickerProps {
  items?: Blog[];
  onVisibilityChange?: (visible: boolean) => void;
}

export default function BreakingNewsTicker({
  items: externalItems,
  onVisibilityChange,
}: BreakingNewsTickerProps) {
  const [items, setItems] = useState<Blog[]>(externalItems ?? []);

  useEffect(() => {
    if (externalItems && externalItems.length > 0) {
      setItems(externalItems);
      return;
    }
    let cancelled = false;
    cachedGet<Blog[]>('/blogs?limit=5')
      .then((data) => {
        if (!cancelled) setItems(data ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [externalItems]);

  const notifyVisibility = useCallback(
    (visible: boolean) => onVisibilityChange?.(visible),
    [onVisibilityChange]
  );

  useEffect(() => {
    notifyVisibility(items.length > 0);
  }, [items.length, notifyVisibility]);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="site-header-ticker relative z-[2] h-9 w-full shrink-0 overflow-hidden border-b border-red-500/20 bg-[#010409]/90 backdrop-blur-md"
      aria-label="Breaking news"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-600/[0.06] via-transparent to-violet-600/[0.04]" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-5 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/[0.06] pr-3 sm:pr-4">
          <div className="flex items-center gap-1.5 rounded-md bg-red-500/12 px-2 py-0.5 ring-1 ring-red-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <Zap className="h-3 w-3 text-red-400" aria-hidden />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-400">
              Breaking AI News
            </span>
          </div>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#010409] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#010409] to-transparent" />
          <div className="ticker-track items-center">
            {doubled.map((item, i) => (
              <Link
                key={`${item._id}-${i}`}
                href={`/blogs/${item._id}`}
                className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-white sm:text-xs"
              >
                <span className="h-px w-3 shrink-0 bg-gradient-to-r from-red-500/60 to-violet-500/60 transition-all group-hover:w-5" aria-hidden />
                <span className="max-w-[min(68vw,20rem)] truncate sm:max-w-md">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const TICKER_HEIGHT_PX = 36;
