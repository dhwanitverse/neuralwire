export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString).getTime();
  if (Number.isNaN(date)) return '';
  const diff = Date.now() - date;
  const mins = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(dateString);
}

export function extractHeadings(content: string): { id: string; text: string }[] {
  return content
    .split('\n\n')
    .filter((p) => p.startsWith('## '))
    .map((p) => {
      const text = p.replace('## ', '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { id, text };
    });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Artificial Intelligence': 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    'Web Development': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    'Mobile Apps': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    'Cyber Security': 'bg-red-500/20 text-red-300 border border-red-500/30',
    'Cloud Computing': 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    Programming: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    Gadgets: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    'Tech News': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  };
  return colors[category] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
}

export function getCategoryColorLight(category: string): string {
  return getCategoryColor(category);
}

export const CATEGORIES = [
  'Artificial Intelligence',
  'Web Development',
  'Mobile Apps',
  'Cyber Security',
  'Cloud Computing',
  'Programming',
  'Gadgets',
  'Tech News',
] as const;
