'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FileText,
  Eye,
  FilePen,
  Clock,
  Heart,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tags,
  Settings,
} from 'lucide-react';
import api from '@/lib/api';
import { invalidateCache } from '@/lib/fetchCache';
import { Blog } from '@/types';
import { CATEGORIES } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import AnalyticsPreview from '@/components/dashboard/AnalyticsPreview';
import ArticleToolbar, { ViewMode } from '@/components/dashboard/ArticleToolbar';
import ArticleTableView from '@/components/dashboard/ArticleTableView';
import ArticleGridView from '@/components/dashboard/ArticleGridView';
import PremiumEmptyState from '@/components/dashboard/PremiumEmptyState';
import {
  buildActivityItems,
  computeEngagementRate,
  estimateReadTime,
  filterAndSortBlogs,
  formatReadTime,
  getCategoryDistribution,
  sparklineFromValue,
  type DateFilter,
  type SortKey,
} from '@/lib/dashboardUtils';

const PAGE_SIZE = 8;

function DashboardPageContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    api.get('/blogs/user/my-blogs')
      .then((r) => setBlogs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const urlQuery = searchParams.get('q');
    if (urlStatus === 'draft') setStatus('draft');
    else if (urlStatus === 'published') setStatus('published');
    else if (!searchParams.get('section')) setStatus((s) => (s === 'draft' && !urlStatus ? 'all' : s));

    if (urlQuery) setSearch(urlQuery);

    const hash = window.location.hash;
    const section = searchParams.get('section');
    const target = hash || (section === 'articles' ? '#articles' : null);
    if (target) {
      requestAnimationFrame(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [searchParams]);

  const categories = useMemo(() => [...new Set(blogs.map((b) => b.category))], [blogs]);
  const publishedCount = blogs.length;
  const draftCount = 0;
  const totalViews = useMemo(() => blogs.reduce((s, b) => s + (b.views ?? 0), 0), [blogs]);
  const avgReadTime = useMemo(() => {
    if (!blogs.length) return 0;
    const total = blogs.reduce((s, b) => s + estimateReadTime(b.content), 0);
    return Math.round(total / blogs.length);
  }, [blogs]);
  const engagement = useMemo(() => computeEngagementRate(blogs), [blogs]);
  const activity = useMemo(() => buildActivityItems(blogs), [blogs]);
  const categoryDist = useMemo(() => getCategoryDistribution(blogs), [blogs]);

  const filtered = useMemo(
    () => filterAndSortBlogs(blogs, { search, category, status, dateFilter, sort }),
    [blogs, search, category, status, dateFilter, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, category, status, dateFilter, sort]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((b) => b._id)));
  };

  const requestDelete = (id: string) => {
    setPendingDelete(id);
    setConfirmOpen(true);
  };

  const requestBulkDelete = () => {
    if (!selected.size) return;
    setPendingDelete('bulk');
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!pendingDelete) return;
    setConfirmOpen(false);
    if (pendingDelete === 'bulk') {
      const ids = Array.from(selected);
      try {
        await Promise.all(ids.map((id) => api.delete(`/blogs/${id}`)));
        invalidateCache('/blogs');
        setBlogs((p) => p.filter((b) => !selected.has(b._id)));
        setSelected(new Set());
        toast.success(`${ids.length} article(s) deleted`);
      } catch {
        toast.error('Bulk delete failed');
      }
    } else {
      setDeleting(pendingDelete);
      try {
        await api.delete(`/blogs/${pendingDelete}`);
        invalidateCache('/blogs');
        setBlogs((p) => p.filter((b) => b._id !== pendingDelete));
        setSelected((prev) => {
          const n = new Set(prev);
          n.delete(pendingDelete);
          return n;
        });
        toast.success('Article deleted');
      } catch {
        toast.error('Delete failed');
      } finally {
        setDeleting(null);
      }
    }
    setPendingDelete(null);
  };

  const emptyVariant =
    blogs.length === 0 ? 'no-articles' : status === 'draft' ? 'no-drafts' : 'no-matches';

  const showOverviewStats = !searchParams.get('section') && searchParams.get('status') !== 'draft';

  return (
    <div className="dash-page">
      {showOverviewStats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <DashboardStatCard
              label="Total Articles"
              value={blogs.length}
              icon={FileText}
              gradient="from-blue-500 to-indigo-600"
              glow="glow-blue"
              sparkData={sparklineFromValue(blogs.length * 3 + 1)}
              trend={blogs.length > 0 ? 12 : 0}
              delay={0}
            />
            <DashboardStatCard
              label="Published"
              value={publishedCount}
              icon={CheckCircle2}
              gradient="from-emerald-500 to-teal-600"
              glow="glow-emerald"
              sparkData={sparklineFromValue(publishedCount * 5 + 2)}
              trend={publishedCount > 0 ? 8 : 0}
              delay={0.04}
            />
            <DashboardStatCard
              label="Drafts"
              value={draftCount}
              icon={FilePen}
              gradient="from-amber-500 to-orange-600"
              glow="glow-amber"
              sparkData={sparklineFromValue(draftCount + 1)}
              trend={0}
              delay={0.08}
            />
            <DashboardStatCard
              label="Total Views"
              value={totalViews}
              icon={Eye}
              gradient="from-violet-500 to-purple-600"
              glow="glow-violet"
              sparkData={sparklineFromValue(totalViews + 7)}
              trend={totalViews > 0 ? 24 : 0}
              delay={0.12}
            />
            <DashboardStatCard
              label="Avg Read Time"
              value={avgReadTime}
              icon={Clock}
              gradient="from-cyan-500 to-blue-600"
              glow="glow-cyan"
              sparkData={sparklineFromValue(avgReadTime * 4 + 3)}
              trend={avgReadTime > 0 ? 5 : 0}
              delay={0.16}
              format="time"
              timeLabel={avgReadTime ? formatReadTime(avgReadTime) : '—'}
            />
            <DashboardStatCard
              label="Engagement"
              value={engagement}
              icon={Heart}
              gradient="from-pink-500 to-rose-600"
              glow="glow-violet"
              sparkData={sparklineFromValue(engagement * 2 + 4)}
              trend={engagement > 0 ? 15 : 0}
              delay={0.2}
              format="percent"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="dash-panel lg:col-span-5"
            >
              <h3 className="mb-4 font-display text-base font-semibold text-white">Recent activity</h3>
              <ActivityTimeline items={activity} />
            </motion.div>
            <div className="lg:col-span-7">
              <AnalyticsPreview blogs={blogs} />
            </div>
          </div>
        </>
      )}

      <section id="articles" className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Article management</h2>
            <p className="text-sm text-slate-500">Search, filter, and manage your editorial content</p>
          </div>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/25"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selected.size})
            </button>
          )}
        </div>

        <ArticleToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
          resultCount={filtered.length}
        />

        {loading ? (
          <div className="py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6">
            <PremiumEmptyState variant={emptyVariant} />
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <ArticleTableView
                blogs={paginated}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                onEdit={(id) => router.push(`/dashboard/edit/${id}`)}
                onDelete={requestDelete}
                deleting={deleting}
              />
            ) : null}

            <ArticleGridView
              blogs={paginated}
              onEdit={(id) => router.push(`/dashboard/edit/${id}`)}
              onDelete={requestDelete}
              deleting={deleting}
              className={viewMode === 'table' ? 'mt-4 lg:hidden' : 'mt-4'}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="dash-pagination-btn"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`dash-pagination-num ${p === page ? 'is-active' : ''}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="dash-pagination-btn"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section id="categories" className="mt-10">
        <div className="dash-panel">
          <div className="mb-4 flex items-center gap-2">
            <Tags className="h-4 w-4 text-violet-400" />
            <h3 className="font-display text-base font-semibold text-white">Categories</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const count = categoryDist.find((c) => c.category === cat)?.count ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dash-category-chip"
                >
                  <span className="text-sm text-slate-300">{cat}</span>
                  <span className="text-xs font-semibold text-violet-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="settings" className="mt-10 mb-8">
        <div className="dash-panel">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-400" />
            <h3 className="font-display text-base font-semibold text-white">Settings</h3>
          </div>
          <p className="text-sm text-slate-500">
            Account preferences and editorial settings will appear here. Manage your profile from the header menu.
          </p>
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title={pendingDelete === 'bulk' ? 'Delete selected articles?' : 'Delete this article?'}
        message={
          pendingDelete === 'bulk'
            ? `This will permanently delete ${selected.size} article(s). This action cannot be undone.`
            : 'This article will be permanently deleted. This action cannot be undone.'
        }
        confirmLabel="Delete"
        loading={!!deleting}
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <DashboardPageContent />
    </Suspense>
  );
}
