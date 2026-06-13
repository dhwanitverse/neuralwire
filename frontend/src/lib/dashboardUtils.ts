import { Blog } from '@/types';

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min`;
}

export function sparklineFromValue(seed: number, points = 10): number[] {
  const base = Math.max(4, seed % 40);
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.9) * 12;
    const trend = i * (base / points) * 0.35;
    return Math.max(2, Math.round(base + wave + trend));
  });
}

export function computeEngagementRate(blogs: Blog[]): number {
  if (!blogs.length) return 0;
  const viewsPerArticle = blogs.reduce((s, b) => s + (b.views ?? 0), 0) / blogs.length;
  return Math.min(99, Math.round(viewsPerArticle * 1.8 + blogs.length * 2));
}

export function computePublishingStreak(blogs: Blog[]): number {
  if (!blogs.length) return 0;
  const days = new Set(
    blogs.map((b) => new Date(b.createdAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getTopArticle(blogs: Blog[]): Blog | null {
  if (!blogs.length) return null;
  return [...blogs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))[0];
}

export function getCategoryDistribution(blogs: Blog[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  blogs.forEach((b) => map.set(b.category, (map.get(b.category) ?? 0) + 1));
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getViewsByWeek(blogs: Blog[]): { label: string; views: number }[] {
  const weeks: { label: string; views: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const label = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const views = blogs
      .filter((b) => {
        const d = new Date(b.createdAt);
        return d >= start && d < end;
      })
      .reduce((s, b) => s + (b.views ?? 0), 0);
    weeks.push({ label, views });
  }
  return weeks;
}

export type ArticleStatus = 'published' | 'draft';

export function getArticleStatus(_blog: Blog): ArticleStatus {
  return 'published';
}

export type SortKey = 'newest' | 'oldest' | 'views' | 'title';
export type DateFilter = 'all' | '7d' | '30d' | '90d';

export function filterAndSortBlogs(
  blogs: Blog[],
  opts: {
    search: string;
    category: string;
    status: string;
    dateFilter: DateFilter;
    sort: SortKey;
  }
): Blog[] {
  const now = Date.now();
  const dateMs: Record<DateFilter, number> = {
    all: 0,
    '7d': 7 * 86400000,
    '30d': 30 * 86400000,
    '90d': 90 * 86400000,
  };

  let result = blogs.filter((b) => {
    const matchSearch =
      !opts.search || b.title.toLowerCase().includes(opts.search.toLowerCase());
    const matchCat = !opts.category || b.category === opts.category;
    const matchStatus =
      !opts.status ||
      opts.status === 'all' ||
      (opts.status === 'published' && getArticleStatus(b) === 'published') ||
      (opts.status === 'draft' && getArticleStatus(b) === 'draft');
    const matchDate =
      opts.dateFilter === 'all' ||
      now - new Date(b.updatedAt).getTime() <= dateMs[opts.dateFilter];
    return matchSearch && matchCat && matchStatus && matchDate;
  });

  result = [...result].sort((a, b) => {
    switch (opts.sort) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'views':
        return (b.views ?? 0) - (a.views ?? 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return result;
}

export function buildActivityItems(blogs: Blog[]) {
  return [...blogs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)
    .map((b) => ({
      id: b._id,
      title: b.title,
      date: b.updatedAt,
      type: 'publish' as const,
      views: b.views ?? 0,
    }));
}
