'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Plus,
  FileStack,
  FilePen,
  BarChart3,
  Tags,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PenLine,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

const NAV_SECTIONS = [
  {
    label: 'Studio',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, match: 'overview' as const },
      { href: '/dashboard/create', label: 'New Article', icon: Plus, match: 'create' as const },
      { href: '/dashboard?section=articles', label: 'My Articles', icon: FileStack, match: 'articles' as const },
      { href: '/dashboard?status=draft', label: 'Drafts', icon: FilePen, match: 'drafts' as const },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/dashboard#analytics', label: 'Analytics', icon: BarChart3, match: 'analytics' as const },
      { href: '/dashboard#categories', label: 'Categories', icon: Tags, match: 'categories' as const },
      { href: '/dashboard#settings', label: 'Settings', icon: Settings, match: 'settings' as const },
    ],
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function UserProfileCard({ collapsed, onLogout }: { collapsed: boolean; onLogout: () => void }) {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`dash-profile-card ${collapsed ? 'is-collapsed' : ''}`}>
      {user?.profilePicture && !imgError ? (
        <Image
          src={user.profilePicture}
          alt={user.name}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-violet-500/25"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-violet-600 to-cyan-500 text-sm font-bold text-white ring-2 ring-violet-500/20">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      )}
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-violet-400/80">Editor</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

export default function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const [hash, setHash] = useState('');

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [pathname]);

  const checkActive = (match: string) => {
    if (match === 'create') return pathname.startsWith('/dashboard/create') || pathname.includes('/dashboard/edit');
    if (match === 'overview') {
      return pathname === '/dashboard' && !searchParams.get('status') && !searchParams.get('section') && !hash;
    }
    if (match === 'articles') return pathname === '/dashboard' && searchParams.get('section') === 'articles';
    if (match === 'drafts') return pathname === '/dashboard' && searchParams.get('status') === 'draft';
    if (match === 'analytics') return hash === '#analytics';
    if (match === 'categories') return hash === '#categories';
    if (match === 'settings') return hash === '#settings';
    return false;
  };

  const sidebarContent = (
    <>
      <div className={`dash-sidebar-head ${collapsed ? 'is-collapsed' : ''}`}>
        <Logo size={collapsed ? 'sm' : 'md'} variant="lockup" showTagline={!collapsed} />
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2">
            <PenLine className="h-3.5 w-3.5 text-violet-400" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Editorial Studio</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="dash-sidebar-collapse hidden lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="dash-sidebar-nav flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = checkActive(item.match);
                const inner = (
                  <>
                    <span className="dash-sidebar-icon-wrap">
                      <item.icon className="h-4 w-4" />
                      {active && <span className="dash-sidebar-glow" aria-hidden />}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </>
                );
                const className = `dash-sidebar-link ${active ? 'is-active' : ''} ${collapsed ? 'is-collapsed' : ''}`;
                return item.href.includes('#') ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    title={collapsed ? item.label : undefined}
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    title={collapsed ? item.label : undefined}
                    className={className}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href="/"
          onClick={onMobileClose}
          title={collapsed ? 'View Site' : undefined}
          className={`dash-sidebar-link dash-sidebar-link-muted ${collapsed ? 'is-collapsed' : ''}`}
        >
          <span className="dash-sidebar-icon-wrap">
            <ExternalLink className="h-4 w-4" />
          </span>
          {!collapsed && <span>View Site</span>}
        </Link>
      </nav>

      <div className="dash-sidebar-foot">
        <UserProfileCard collapsed={collapsed} onLogout={logout} />
      </div>
    </>
  );

  return (
    <>
      <aside className={`dash-sidebar hidden lg:flex ${collapsed ? 'is-collapsed' : ''}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="dash-sidebar-mobile-overlay lg:hidden" onClick={onMobileClose} aria-hidden />
      )}
      <aside className={`dash-sidebar dash-sidebar-mobile lg:hidden ${mobileOpen ? 'is-open' : ''}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
