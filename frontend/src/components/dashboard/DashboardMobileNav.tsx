'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileStack, Plus, BarChart3, Menu } from 'lucide-react';

interface DashboardMobileNavProps {
  onMenuOpen: () => void;
}

const ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard?section=articles', label: 'Articles', icon: FileStack, exact: false },
  { href: '/dashboard/create', label: 'New', icon: Plus, exact: false, accent: true },
  { href: '/dashboard#analytics', label: 'Analytics', icon: BarChart3, exact: false },
];

export default function DashboardMobileNav({ onMenuOpen }: DashboardMobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="dash-mobile-nav lg:hidden" aria-label="Dashboard navigation">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href.split('?')[0].split('#')[0]);
        if (item.accent) {
          return (
            <Link key={item.href} href={item.href} className="dash-mobile-nav-fab" aria-label={item.label}>
              <item.icon className="h-5 w-5" />
            </Link>
          );
        }
        const className = `dash-mobile-nav-item ${active ? 'is-active' : ''}`;
        return item.href.includes('#') ? (
          <a key={item.href} href={item.href} className={className}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ) : (
          <Link key={item.href} href={item.href} className={className}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button type="button" onClick={onMenuOpen} className="dash-mobile-nav-item" aria-label="More">
        <Menu className="h-4 w-4" />
        <span>More</span>
      </button>
    </nav>
  );
}
