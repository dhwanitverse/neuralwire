'use client';

import Link from 'next/link';
import { ArrowUpRight, Clock, Radio } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import { Blog } from '@/types';
import { getReadingTime, getRelativeTime, getCategoryColor } from '@/lib/utils';

interface LatestArticlesProps {
  blogs: Blog[];
}

/**
 * "Live signal feed" — a wire-style timeline of the freshest articles.
 * Distinct from the Editor's Picks showcase: a chronological feed with a
 * glowing rail, a highlighted lead drop, and compact scannable rows.
 */
export default function LatestArticles({ blogs }: LatestArticlesProps) {
  if (!blogs.length) {
    return (
      <p className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-10 text-center text-slate-400">
        No articles yet.{' '}
        <Link href="/blogs" className="text-violet-400 hover:text-violet-300">
          Browse all articles
        </Link>
      </p>
    );
  }

  const [lead, ...rest] = blogs.slice(0, 6);
  const feed = rest.slice(0, 4);

  return (
    <div className="nw-feed relative">
      {/* Glowing timeline rail */}
      <span
        className="pointer-events-none absolute bottom-3 left-[14px] top-3 w-px bg-gradient-to-b from-violet-500/50 via-cyan-400/25 to-transparent sm:left-[18px]"
        aria-hidden
      />

      <div className="space-y-3 sm:space-y-4">
        <FeedNode isLead>
          <LeadCard blog={lead} />
        </FeedNode>

        {feed.map((blog) => (
          <FeedNode key={blog._id}>
            <FeedRow blog={blog} />
          </FeedNode>
        ))}
      </div>
    </div>
  );
}

function FeedNode({ children, isLead }: { children: React.ReactNode; isLead?: boolean }) {
  return (
    <div className="relative pl-9 sm:pl-12">
      <span
        className={`absolute top-6 z-[1] -translate-x-1/2 rounded-full ring-4 ring-[var(--nw-bg)] ${
          isLead
            ? 'left-[14px] h-3 w-3 bg-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.9)] sm:left-[18px]'
            : 'left-[14px] h-2 w-2 bg-slate-600 sm:left-[18px]'
        }`}
        aria-hidden
      >
        {isLead && (
          <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/70" aria-hidden />
        )}
      </span>
      {children}
    </div>
  );
}

function LeadCard({ blog }: { blog: Blog }) {
  const readTime = getReadingTime(blog.content);
  const badge = getCategoryColor(blog.category);

  return (
    <Link
      href={`/blogs/${blog._id}`}
      className="nw-feed-lead group relative grid overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--nw-card)] transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_50px_-16px_rgba(139,92,246,0.55)] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
    >
      <div className="order-2 flex min-w-0 flex-col justify-center p-5 sm:order-1 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/30">
            <Radio className="h-3 w-3" /> Just in
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{blog.category}</span>
          <span className="text-[11px] text-slate-500">{getRelativeTime(blog.createdAt)}</span>
        </div>

        <h3 className="font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-violet-200 sm:text-2xl">
          {blog.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm text-slate-400">{blog.description}</p>

        <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-medium text-slate-300">{blog.author}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min read</span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="relative order-1 min-h-[180px] overflow-hidden sm:order-2 sm:min-h-full">
        <SafeImage
          src={blog.image}
          alt={blog.title}
          fill
          className="nw-card-media-img object-cover"
          sizes="(max-width: 640px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--nw-card)] via-transparent to-transparent sm:bg-gradient-to-l" />
      </div>
    </Link>
  );
}

function FeedRow({ blog }: { blog: Blog }) {
  const readTime = getReadingTime(blog.content);
  const badge = getCategoryColor(blog.category);

  return (
    <Link
      href={`/blogs/${blog._id}`}
      className="nw-feed-row group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 pr-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] sm:gap-5"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:h-[72px] sm:w-28">
        <SafeImage
          src={blog.image}
          alt={blog.title}
          fill
          className="nw-card-media-img object-cover"
          sizes="112px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${badge}`}>{blog.category}</span>
          <span className="text-[11px] text-slate-500">{getRelativeTime(blog.createdAt)}</span>
          <span className="hidden items-center gap-1 text-[11px] text-slate-600 sm:inline-flex">
            <Clock className="h-3 w-3" />{readTime} min
          </span>
        </div>
        <h4 className="font-display mt-1 line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-violet-200 sm:text-base">
          {blog.title}
        </h4>
        <p className="mt-0.5 line-clamp-1 hidden text-xs text-slate-500 sm:block">{blog.description}</p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300" />
    </Link>
  );
}
