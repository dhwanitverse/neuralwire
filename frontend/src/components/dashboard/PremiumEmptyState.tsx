import Link from 'next/link';
import { PenLine, Upload, Sparkles } from 'lucide-react';

interface PremiumEmptyStateProps {
  variant?: 'no-articles' | 'no-matches' | 'no-drafts';
}

export default function PremiumEmptyState({ variant = 'no-articles' }: PremiumEmptyStateProps) {
  const copy = {
    'no-articles': {
      title: 'No articles yet',
      description: 'Start publishing your first NeuralWire story.',
      primary: 'Create your first article',
      primaryHref: '/dashboard/create',
      showImport: true,
    },
    'no-matches': {
      title: 'No matches found',
      description: 'Try adjusting your search or filters to find articles.',
      primary: 'Clear filters',
      primaryHref: '/dashboard',
      showImport: false,
    },
    'no-drafts': {
      title: 'No drafts saved',
      description: 'Draft support is coming soon. Publish directly or start a new article.',
      primary: 'New article',
      primaryHref: '/dashboard/create',
      showImport: false,
    },
  }[variant];

  return (
    <div className="dash-empty-state">
      <div className="dash-empty-glow" aria-hidden />
      <div className="relative flex flex-col items-center text-center">
        <div className="dash-empty-icon">
          <Sparkles className="h-8 w-8 text-violet-400" />
          <PenLine className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md bg-slate-900 p-0.5 text-cyan-400 ring-1 ring-white/10" />
        </div>
        <h3 className="font-display mt-6 text-xl font-bold text-white">{copy.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{copy.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={copy.primaryHref} className="dash-btn-primary inline-flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            {copy.primary}
          </Link>
          {copy.showImport && (
            <Link href="/dashboard/create" className="dash-btn-ghost inline-flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import draft
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
