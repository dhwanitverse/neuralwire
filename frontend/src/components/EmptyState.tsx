import { LucideIcon, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: LucideIcon;
  dark?: boolean;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon: Icon = FileText,
  dark = true,
}: EmptyStateProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-6 py-20 text-center ${
        dark
          ? 'border-white/[0.1] bg-gradient-to-b from-white/[0.03] to-transparent'
          : 'border-slate-200 bg-white'
      }`}
    >
      {dark && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />
      )}
      <div className="relative">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            dark
              ? 'nw-card-premium ring-1 ring-violet-500/20'
              : 'bg-gradient-to-br from-indigo-50 to-violet-50 ring-1 ring-indigo-100'
          }`}
        >
          <Icon className={`h-8 w-8 ${dark ? 'text-violet-400' : 'text-indigo-500'}`} />
        </div>
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-cyan-400/80" aria-hidden />
      </div>
      <h3 className={`font-display relative mt-6 text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={`relative mt-2 max-w-sm text-sm leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-600'}`}>
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="nw-btn-primary relative mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
