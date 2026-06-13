'use client';

import { useEffect, useState, useCallback, Suspense, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Flame, Clock, TrendingUp } from 'lucide-react';
import { getAllNews } from '@/lib/newsApi';
import { cachedGet } from '@/lib/fetchCache';
import { Blog } from '@/types';
import { BRAND } from '@/lib/brand';
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/ui/BlogCardSkeleton';
import CategoryChips from '@/components/CategoryChips';
import EmptyState from '@/components/EmptyState';

const PAGE_SIZE = 9;
const MAX_VISIBLE = 54;
const TRENDING_TAGS = ['OpenAI', 'Claude', 'Gemini', 'Nvidia', 'Anthropic', 'Cybersecurity', 'Startups', 'Next.js', 'AWS', 'Apple'];

type SortMode = 'latest' | 'popular' | 'trending';

function BlogGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
    </div>
  );
}

function BlogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featured, setFeatured] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState<SortMode>('latest');
  const [searchOpen, setSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadMoreLock = useRef(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    const t = setTimeout(() => {
      Promise.all([
        getAllNews({ search: search || undefined, field: category || undefined }),
        !search && !category
          ? cachedGet<Blog[]>('/blogs?featured=true&limit=1')
          : Promise.resolve([] as Blog[]),
      ])
        .then(([news, featuredList]) => {
          if (cancelled) return;
          setBlogs(news.data);
          setFeatured(featuredList[0] || null);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, category]);

  const sorted = useMemo(() => {
    const list = [...blogs];
    if (sort === 'popular') return list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    if (sort === 'trending') return list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [blogs, sort]);

  const gridBlogs = sorted.filter((b) => !featured || b._id !== featured._id);
  const visible = gridBlogs.slice(0, visibleCount);
  const cappedTotal = Math.min(gridBlogs.length, MAX_VISIBLE);
  const hasMore = visibleCount < cappedTotal;

  const loadMore = useCallback(() => {
    if (loadMoreLock.current) return;
    loadMoreLock.current = true;
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, cappedTotal));
    window.setTimeout(() => {
      loadMoreLock.current = false;
    }, 400);
  }, [cappedTotal]);

  useEffect(() => {
    if (!infiniteMode || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '120px', threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [infiniteMode, hasMore, loadMore]);

  const applyTag = (tag: string) => {
    setSearch(tag);
    router.push(`/blogs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#030712] pb-14 pt-10 sm:pt-14">
        <div className="absolute inset-0 hero-mesh opacity-50" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-orb left-1/4 top-0 h-64 w-64 bg-violet-600/20" />
        <div className="glow-orb right-1/4 top-1/3 h-48 w-48 bg-blue-600/15" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
          >
            {BRAND.name} Magazine
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Technology <span className="gradient-text">Newsroom</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-slate-400 text-balance"
          >
            {BRAND.description}
          </motion.p>
          <div className="section-divider mx-auto mt-8 w-24" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="nw-card-premium -mt-8 rounded-2xl p-4 shadow-xl shadow-black/20 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm text-slate-500 hover:border-violet-500/30"
            >
              <Search className="h-4 w-4" /> {search || 'Search articles, topics, companies...'}
            </button>
            <div className="flex items-center gap-2">
              {(['latest', 'popular', 'trending'] as SortMode[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all ${
                    sort === s ? 'bg-violet-500/20 text-violet-300' : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {s === 'latest' && <Clock className="h-3.5 w-3.5" />}
                  {s === 'popular' && <Flame className="h-3.5 w-3.5" />}
                  {s === 'trending' && <TrendingUp className="h-3.5 w-3.5" />}
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4"><CategoryChips active={category} onChange={setCategory} /></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => applyTag(tag)}
                className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 transition-all hover:border-violet-500/30 hover:text-violet-300"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed left-1/2 top-[20%] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
              >
                <div className="nw-glass rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-violet-400" />
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSearchOpen(false); }}
                      placeholder="Search NeuralWire..."
                      className="flex-1 bg-transparent py-2 text-white focus:outline-none"
                    />
                    <button onClick={() => setSearchOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {!loading && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {sorted.length} article{sorted.length !== 1 ? 's' : ''}
              {category && <span className="text-violet-400"> · {category}</span>}
            </p>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              <input type="checkbox" checked={infiniteMode} onChange={(e) => setInfiniteMode(e.target.checked)} className="rounded text-violet-500" />
              Infinite scroll
            </label>
          </div>
        )}

        {/* Featured story */}
        {!loading && featured && !search && !category && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-violet-400">Featured Story</p>
            <BlogCard blog={featured} variant="featured" />
          </motion.div>
        )}

        <div className="mt-10">
          {loading ? (
            <BlogGridSkeleton />
          ) : gridBlogs.length === 0 ? (
            <EmptyState dark title="No articles found" description="Try a different search, tag, or category." />
          ) : (
            <>
              <div className="masonry-grid">
                {visible.map((b, i) => (
                  <div key={b._id} className="masonry-item">
                    <BlogCard blog={b} index={i} showTrending={(b.views ?? 0) > 15000} />
                  </div>
                ))}
              </div>
              {hasMore && !infiniteMode && (
                <div className="mt-10 text-center">
                  <button onClick={loadMore} className="nw-btn-primary rounded-xl px-8 py-3 text-sm font-semibold text-white">Load more</button>
                </div>
              )}
              {hasMore && infiniteMode && <div ref={loaderRef} className="mt-8 flex justify-center"><BlogCardSkeleton /></div>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogGridSkeleton />}>
      <BlogsContent />
    </Suspense>
  );
}
