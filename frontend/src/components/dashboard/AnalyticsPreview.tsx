'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Trophy, PieChart } from 'lucide-react';
import { Blog } from '@/types';
import {
  computePublishingStreak,
  getCategoryDistribution,
  getTopArticle,
  getViewsByWeek,
} from '@/lib/dashboardUtils';

interface AnalyticsPreviewProps {
  blogs: Blog[];
}

export default function AnalyticsPreview({ blogs }: AnalyticsPreviewProps) {
  const weeks = getViewsByWeek(blogs);
  const maxViews = Math.max(...weeks.map((w) => w.views), 1);
  const categories = getCategoryDistribution(blogs);
  const maxCat = Math.max(...categories.map((c) => c.count), 1);
  const top = getTopArticle(blogs);
  const streak = computePublishingStreak(blogs);

  return (
    <motion.section
      id="analytics"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="dash-panel"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-base font-semibold text-white">Analytics preview</h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Live</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="dash-analytics-card">
          <p className="mb-3 text-xs font-medium text-slate-500">Views over time</p>
          <div className="flex h-28 items-end gap-1.5">
            {weeks.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="dash-bar w-full rounded-t-md bg-gradient-to-t from-violet-600/80 to-cyan-500/60 transition-all duration-500"
                  style={{ height: `${Math.max(8, (w.views / maxViews) * 100)}%` }}
                  title={`${w.views} views`}
                />
                <span className="text-[9px] text-slate-600">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-analytics-card">
          <div className="mb-3 flex items-center gap-2">
            <PieChart className="h-3.5 w-3.5 text-violet-400" />
            <p className="text-xs font-medium text-slate-500">Category distribution</p>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-slate-600">Publish articles to see breakdown.</p>
          ) : (
            <div className="space-y-2.5">
              {categories.slice(0, 4).map((c) => (
                <div key={c.category}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="truncate text-slate-400">{c.category}</span>
                    <span className="text-slate-600">{c.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{ width: `${(c.count / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-analytics-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/25">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Top performer</p>
            {top ? (
              <>
                <Link href={`/blogs/${top._id}`} className="line-clamp-1 text-sm font-medium text-white hover:text-violet-300">
                  {top.title}
                </Link>
                <p className="text-xs text-slate-500">{top.views ?? 0} views · {top.category}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">No data yet</p>
            )}
          </div>
        </div>

        <div className="dash-analytics-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/25">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Publishing streak</p>
            <p className="font-display text-2xl font-bold text-white">
              {streak} <span className="text-base font-medium text-slate-500">day{streak !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-xs text-slate-600">Keep the momentum going</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
