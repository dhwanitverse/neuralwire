'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Bell,
  Sparkles,
  Menu,
  Command,
  Radio,
} from 'lucide-react';
import NavUserMenu from '@/components/nav/NavUserMenu';
import { openCommandPalette } from '@/lib/openSearch';
import { useAuth } from '@/context/AuthContext';

interface DashboardTopbarProps {
  onMenuOpen: () => void;
}

function useDateTime() {
  const [value, setValue] = useState({ date: '', time: '' });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setValue({
        date: now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        time: now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return value;
}

function pageMeta(pathname: string, firstName?: string) {
  if (pathname === '/dashboard/create') {
    return { eyebrow: 'Editorial Studio', title: 'New Article', subtitle: 'Craft and publish your next story' };
  }
  if (pathname.includes('/dashboard/edit')) {
    return { eyebrow: 'Editorial Studio', title: 'Edit Article', subtitle: 'Update your editorial content' };
  }
  if (pathname === '/dashboard') {
    return {
      eyebrow: 'Command Center',
      title: firstName ? `Welcome back, ${firstName}` : 'Welcome back',
      subtitle: 'Manage your NeuralWire publication',
    };
  }
  if (pathname.startsWith('/dashboard')) {
    return { eyebrow: 'Editorial Studio', title: 'Dashboard', subtitle: '' };
  }
  return { eyebrow: 'Editorial Studio', title: 'Dashboard', subtitle: '' };
}

export default function DashboardTopbar({ onMenuOpen }: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { date, time } = useDateTime();
  const [notifOpen, setNotifOpen] = useState(false);
  const [articleQuery, setArticleQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  const meta = pageMeta(pathname, user?.name?.split(' ')[0]);

  useEffect(() => {
    if (!notifOpen) return;
    const close = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [notifOpen]);

  const handleArticleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = articleQuery.trim();
    if (!q) {
      router.push('/dashboard?section=articles');
      return;
    }
    router.push(`/dashboard?section=articles&q=${encodeURIComponent(q)}`);
    setArticleQuery('');
  };

  return (
    <header className="dash-topbar">
      <div className="dash-topbar-glow" aria-hidden />

      <div className="dash-topbar-inner">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button type="button" onClick={onMenuOpen} className="dash-topbar-icon lg:hidden" aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-400">{meta.eyebrow}</p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="font-display truncate text-base font-bold text-white sm:text-lg">{meta.title}</h1>
              <p className="hidden text-[11px] text-slate-500 sm:inline">
                {date} · {time}
              </p>
            </div>
            {meta.subtitle && (
              <p className="hidden truncate text-xs text-slate-600 md:block">{meta.subtitle}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleArticleSearch} className="dash-topbar-article-search hidden max-w-xs flex-1 lg:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={articleQuery}
            onChange={(e) => setArticleQuery(e.target.value)}
            placeholder="Search articles…"
            className="dash-topbar-search-input"
            aria-label="Search articles"
          />
        </form>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              const q = articleQuery.trim();
              router.push(q ? `/dashboard?section=articles&q=${encodeURIComponent(q)}` : '/dashboard?section=articles');
            }}
            className="dash-topbar-icon lg:hidden"
            aria-label="Search articles"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={openCommandPalette}
            className="dash-topbar-command hidden sm:inline-flex"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden md:inline">Command</span>
            <kbd className="dash-topbar-kbd hidden lg:inline-flex">Ctrl K</kbd>
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="dash-topbar-icon relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 ring-2 ring-[#0a0f1e]" />
            </button>
            {notifOpen && (
              <div className="dash-topbar-dropdown right-0 w-72">
                <p className="border-b border-white/[0.06] px-4 py-3 text-xs font-semibold text-white">Notifications</p>
                <div className="px-4 py-8 text-center text-sm text-slate-500">You&apos;re all caught up</div>
              </div>
            )}
          </div>

          <div className="dash-topbar-status hidden sm:flex" title="Editorial studio is live">
            <Radio className="h-3 w-3 text-emerald-400" />
            <span className="hidden md:inline">Studio Live</span>
          </div>

          <div className="hidden md:block">
            <NavUserMenu variant="dashboard" showName={false} />
          </div>

          <Link href="/dashboard/create" className="dash-topbar-cta">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Article</span>
            <span className="sm:hidden">New</span>
            <Plus className="h-3.5 w-3.5 opacity-80" />
          </Link>
        </div>
      </div>
    </header>
  );
}
