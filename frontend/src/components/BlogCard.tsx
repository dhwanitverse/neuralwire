'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Flame, FileText, Bookmark } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import CardActions from '@/components/CardActions';
import { Blog } from '@/types';
import { formatDate, getReadingTime, getCategoryColor } from '@/lib/utils';

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'featured' | 'editor' | 'horizontal' | 'trending' | 'magazine' | 'compact' | 'radar' | 'list' | 'alert' | 'research';
  index?: number;
  showTrending?: boolean;
}

export default function BlogCard({ blog, variant = 'default', showTrending }: BlogCardProps) {
  const readTime = getReadingTime(blog.content);
  const badge = getCategoryColor(blog.category);
  const isHot = (blog.views ?? 0) > 15000;

  if (variant === 'list') {
    return (
      <article className="group flex gap-4 sm:gap-5">
        <span className="font-display hidden shrink-0 text-2xl font-bold text-white/10 sm:block">
          {String((blog.views ?? 0) % 99).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge}`}>{blog.category}</span>
            <span className="text-[11px] text-slate-500">{formatDate(blog.createdAt)} · {readTime} min</span>
          </div>
          <h3 className="font-display mt-2 text-lg font-bold text-white transition-colors group-hover:text-violet-300">
            <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{blog.description}</p>
        </div>
        <CardActions id={blog._id} title={blog.title} />
      </article>
    );
  }

  if (variant === 'research') {
    return (
      <article className="nw-card-media group flex h-full flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 ring-1 ring-cyan-500/20">
            <FileText className="h-3 w-3" /> Report
          </span>
          <CardActions id={blog._id} title={blog.title} />
        </div>
        <h3 className="font-display line-clamp-3 flex-1 text-xl font-bold leading-snug text-white group-hover:text-violet-200">
          <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-slate-500">{blog.description}</p>
        <MetaRow author={blog.author} date={blog.createdAt} readTime={readTime} />
      </article>
    );
  }

  if (variant === 'alert') {
    return (
      <article className="nw-card-media group overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="33vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-rose-500/10" />
          <span className="absolute left-3 top-3 rounded-md bg-rose-500/20 px-2 py-1 text-[10px] font-bold uppercase text-rose-300 ring-1 ring-rose-500/30">Alert</span>
        </div>
        <CardBody blog={blog} badge={badge} readTime={readTime} isHot={isHot} showTrending={showTrending} />
      </article>
    );
  }

  if (variant === 'radar') {
    return (
      <article className="nw-card-media group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="25vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent" />
          <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
        </div>
        <CardBody blog={blog} badge={badge} readTime={readTime} isHot={isHot} compact />
      </article>
    );
  }

  if (variant === 'trending') {
    return (
      <article className="nw-card-media group w-[300px] shrink-0 overflow-hidden sm:w-[340px]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="340px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-[10px] font-bold text-white">
            <Flame className="h-3 w-3" /> Trending
          </span>
          <div className="absolute right-3 top-3"><CardActions id={blog._id} title={blog.title} /></div>
        </div>
        <div className="p-4">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{blog.category}</span>
          <h3 className="font-display mt-2 line-clamp-2 text-base font-bold text-white group-hover:text-violet-300">
            <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h3>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" />{readTime} min</p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="nw-card-media group h-full overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[140px]">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="200px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent" />
        </div>
        <div className="p-4">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{blog.category}</span>
          <h3 className="font-display mt-2 line-clamp-2 text-sm font-bold text-white group-hover:text-violet-300">
            <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h3>
        </div>
      </article>
    );
  }

  if (variant === 'magazine') {
    return (
      <article className="nw-card-media group overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/40 to-transparent" />
          <span className="absolute left-4 top-4 rounded-md bg-amber-400/90 px-3 py-1 text-[10px] font-bold text-amber-950">Editor&apos;s Pick</span>
        </div>
        <CardBody blog={blog} badge={badge} readTime={readTime} isHot={isHot} />
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="nw-card-media group overflow-hidden rounded-3xl">
        <div className="relative min-h-[400px] lg:min-h-[480px]">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover opacity-50" sizes="(max-width: 1024px) 100vw, 60vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-[#050816]/20" />
          <div className="absolute right-6 top-6 z-10"><CardActions id={blog._id} title={blog.title} /></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
            <span className={`inline-flex w-fit rounded-md px-3 py-1 text-xs font-semibold ${badge}`}>{blog.category}</span>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              <Link href={`/blogs/${blog._id}`} className="hover:text-violet-200">{blog.title}</Link>
            </h2>
            <p className="mt-4 max-w-2xl line-clamp-2 text-base text-slate-400">{blog.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <MetaRow author={blog.author} date={blog.createdAt} readTime={readTime} light />
              <Link href={`/blogs/${blog._id}`} className="nw-btn-primary ml-auto inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white">
                Read <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'editor') {
    return (
      <article className="nw-card-media group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="50vw" />
          <div className="absolute left-4 top-4 rounded-md bg-amber-400/90 px-2.5 py-1 text-[10px] font-bold text-amber-950">Pick</div>
        </div>
        <CardBody blog={blog} badge={badge} readTime={readTime} isHot={isHot} />
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="nw-card-media group flex overflow-hidden">
        <div className="relative min-h-[130px] w-2/5 min-w-[140px] shrink-0 overflow-hidden sm:min-w-[200px]">
          <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="200px" />
        </div>
        <div className="flex flex-1 flex-col justify-center p-5">
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{blog.category}</span>
            <CardActions id={blog._id} title={blog.title} />
          </div>
          <h3 className="font-display mt-2 line-clamp-2 text-base font-bold text-white group-hover:text-violet-300">
            <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h3>
          <MetaRow author={blog.author} date={blog.createdAt} readTime={readTime} compact />
        </div>
      </article>
    );
  }

  return (
    <article className="nw-card-media group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage src={blog.image} alt={blog.title} fill className="nw-card-media-img object-cover" sizes="33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <span className={`absolute left-4 top-4 rounded-md border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${badge}`}>{blog.category}</span>
        {(showTrending || isHot) && (
          <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-300">
            <Flame className="h-3 w-3" /> Hot
          </span>
        )}
        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <CardActions id={blog._id} title={blog.title} />
        </div>
      </div>
      <CardBody blog={blog} badge={badge} readTime={readTime} isHot={isHot} showTrending={showTrending} />
    </article>
  );
}

function CardBody({
  blog, badge, readTime, isHot, showTrending, compact,
}: {
  blog: Blog; badge: string; readTime: number; isHot: boolean; showTrending?: boolean; compact?: boolean;
}) {
  return (
    <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{blog.category}</span>
          <CardActions id={blog._id} title={blog.title} />
        </div>
      )}
      <h3 className={`font-display line-clamp-2 flex-1 font-bold text-white group-hover:text-violet-300 ${compact ? 'text-sm' : 'text-lg'}`}>
        <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
      </h3>
      {!compact && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{blog.description}</p>}
      <MetaRow author={blog.author} date={blog.createdAt} readTime={readTime} compact={compact} />
    </div>
  );
}

function MetaRow({
  author, date, readTime, compact, light,
}: { author: string; date: string; readTime: number; compact?: boolean; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 border-t border-white/[0.06] ${compact ? 'mt-3 pt-3 text-[10px]' : 'mt-4 pt-4 text-xs'} text-slate-500`}>
      <span className={light ? 'text-slate-300' : ''}>{author}</span>
      <span>·</span>
      <span>{formatDate(date)}</span>
      <span>·</span>
      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{readTime}m</span>
      <Bookmark className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" aria-hidden />
    </div>
  );
}
