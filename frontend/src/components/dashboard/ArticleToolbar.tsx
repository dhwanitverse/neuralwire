'use client';

import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '@/lib/utils';
import type { DateFilter, SortKey } from '@/lib/dashboardUtils';

export type ViewMode = 'table' | 'grid';

interface ArticleToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (v: DateFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  categories: string[];
  resultCount: number;
}

export default function ArticleToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  dateFilter,
  onDateFilterChange,
  viewMode,
  onViewModeChange,
  categories,
  resultCount,
}: ArticleToolbarProps) {
  const allCategories = [...new Set([...CATEGORIES, ...categories])];

  return (
    <div className="dash-toolbar">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="dash-search-wrap flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your articles…"
            className="dash-search-input"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="dash-select-wrap">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="dash-select pl-8">
              <option value="">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <select value={status} onChange={(e) => onStatusChange(e.target.value)} className="dash-select">
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <select value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)} className="dash-select">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="views">Most views</option>
            <option value="title">Title A–Z</option>
          </select>

          <select value={dateFilter} onChange={(e) => onDateFilterChange(e.target.value as DateFilter)} className="dash-select">
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <div className="dash-view-toggle">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={viewMode === 'table' ? 'is-active' : ''}
              aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={viewMode === 'grid' ? 'is-active' : ''}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-600">
        {resultCount} article{resultCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
