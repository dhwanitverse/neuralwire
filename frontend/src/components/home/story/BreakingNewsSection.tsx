'use client';

import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { Blog } from '@/types';
import BlogCardSkeleton from '@/components/ui/BlogCardSkeleton';

interface BreakingNewsSectionProps {
  items: Blog[];
  loading?: boolean;
}

export default function BreakingNewsSection({ items, loading }: BreakingNewsSectionProps) {
  const stories = items.slice(0, 4);

  return (
    <div className="relative">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 ring-1 ring-red-500/25">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <Zap className="h-3.5 w-3.5 text-red-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
            Breaking AI News
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 via-violet-500/20 to-transparent" />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <p className="text-sm text-slate-500">No breaking stories yet.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {stories.map((blog, i) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className={`group nw-surface-card flex gap-4 rounded-2xl border p-4 transition-all hover:border-red-500/25 hover:bg-red-500/[0.03] ${
                i === 0
                  ? 'border-red-500/20 bg-red-500/[0.04] sm:col-span-2 lg:flex-row'
                  : 'border-white/[0.06]'
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400/80">
                  {blog.category ?? 'Technology'}
                </p>
                <h3
                  className={`font-display mt-1 font-bold text-white transition-colors group-hover:text-red-100 ${
                    i === 0 ? 'text-xl sm:text-2xl' : 'text-base line-clamp-2'
                  }`}
                >
                  {blog.title}
                </h3>
                {i === 0 && blog.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{blog.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-slate-500 transition-all group-hover:border-red-500/30 group-hover:text-red-300">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
