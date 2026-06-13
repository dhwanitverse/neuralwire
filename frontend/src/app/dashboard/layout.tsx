'use client';

import { useState, useEffect, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/nav/DashboardTopbar';
import DashboardMobileNav from '@/components/dashboard/DashboardMobileNav';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="dash-studio">
      <div className="dash-studio-bg" aria-hidden />
      <Suspense fallback={null}>
        <DashboardSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </Suspense>

      <div className="dash-main">
        <DashboardTopbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="dash-content">{children}</main>
      </div>

      <DashboardMobileNav onMenuOpen={() => setMobileOpen(true)} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
