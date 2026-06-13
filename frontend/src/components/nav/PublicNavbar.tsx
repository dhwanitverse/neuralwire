'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  LayoutDashboard,
  Search,
  ArrowRight,
  Sparkles,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import BreakingNewsTicker, { TICKER_HEIGHT_PX } from '@/components/BreakingNewsTicker';
import NavUserMenu, { NavAvatar } from '@/components/nav/NavUserMenu';
import { openCommandPalette } from '@/lib/openSearch';
import { isPublicSiteRoute } from '@/lib/siteRoutes';

export const PUBLIC_NAV_HEIGHT_PX = 82;

const PUBLIC_NAV_LINKS = [
  { href: '/', label: 'Home', match: 'exact' as const },
  { href: '/blogs', label: 'Articles', match: 'blogs' as const },
  { href: '/about', label: 'About', match: 'exact-path' as const },
  { href: '/contact', label: 'Contact', match: 'exact-path' as const },
];

function PublicNavbarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTicker, setShowTicker] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleTickerVisibility = useCallback((visible: boolean) => {
    setShowTicker(visible);
  }, []);

  if (!isPublicSiteRoute(pathname)) return null;

  const isLinkActive = (link: (typeof PUBLIC_NAV_LINKS)[number]) => {
    if (link.match === 'exact') return pathname === '/';
    if (link.match === 'exact-path') return pathname === link.href;
    if (link.match === 'blogs') return pathname === '/blogs' || pathname.startsWith('/blogs/');
    return false;
  };

  const activeHref = PUBLIC_NAV_LINKS.find((l) => isLinkActive(l))?.href ?? null;
  const navBlockPx = (scrolled ? 8 : 14) + (scrolled ? 56 : 62) + 6;
  const headerOffsetPx = navBlockPx + (showTicker ? TICKER_HEIGHT_PX : 0);

  return (
    <>
      <header className="nw-float-header public-site-header">
        <BreakingNewsTicker onVisibilityChange={handleTickerVisibility} />

        <div className={`nw-float-wrap ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="nw-float-bar"
            >
              <div className="flex shrink-0 items-center gap-3">
                <Logo size="md" variant="lockup" />
                <span className="nw-ai-status hidden 2xl:inline-flex" title="All systems operational">
                  <span className="nw-ai-status-dot" />
                  Online
                </span>
              </div>

              <nav className="hidden min-w-0 flex-1 justify-center lg:flex" aria-label="Main navigation">
                <LayoutGroup id="public-nav">
                  <div className="nw-nav-pill">
                    {PUBLIC_NAV_LINKS.map((l) => {
                      const active = activeHref === l.href;
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          className={`nw-nav-link ${active ? 'is-active' : ''}`}
                        >
                          {active && (
                            <motion.span
                              layoutId="public-nav-active-pill"
                              className="nw-nav-active-bg"
                              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            />
                          )}
                          <span className="relative z-[1]">{l.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={openCommandPalette}
                  className="nw-float-search hidden 2xl:inline-flex"
                  aria-label="Open search"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-violet-400/90" />
                  <span className="truncate text-slate-500">Search…</span>
                  <kbd className="nw-nav-kbd ml-1 inline-flex">Ctrl K</kbd>
                </button>

                {isAuthenticated ? (
                  <div className="hidden items-center md:flex">
                    <NavUserMenu variant="public" />
                  </div>
                ) : (
                  <div className="hidden items-center gap-2 sm:gap-2.5 md:flex">
                    <Link href="/login" className="nw-nav-signin">
                      Sign In
                    </Link>
                    <Link href="/register" className="nw-nav-cta">
                      <span className="nw-nav-cta-label">Get Started</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={openCommandPalette}
                  className="nw-nav-icon-btn 2xl:hidden"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className={`nw-nav-hamburger lg:hidden ${mobileOpen ? 'is-open' : ''}`}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="nw-nav-mobile-overlay lg:hidden"
            style={{ top: headerOffsetPx }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="nw-nav-mobile-panel"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <Logo size="sm" variant="lockup" />
                <button type="button" onClick={() => setMobileOpen(false)} className="nw-nav-icon-btn" aria-label="Close menu">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openCommandPalette();
                  }}
                  className="nw-nav-search mb-8 flex w-full px-4 py-3.5"
                >
                  <Search className="h-4 w-4 text-violet-400" />
                  <span>Search NeuralWire…</span>
                  <kbd className="nw-nav-kbd ml-auto">Ctrl K</kbd>
                </button>

                <nav className="space-y-1" aria-label="Mobile navigation">
                  {PUBLIC_NAV_LINKS.map((l, i) => (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className={`nw-nav-mobile-link ${isLinkActive(l) ? 'is-active' : ''}`}
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-6">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                        <NavAvatar name={user?.name} profilePicture={user?.profilePicture} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                          <p className="truncate text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                      {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/dashboard', label: 'Profile', icon: User },
                        { href: '/dashboard#settings', label: 'Settings', icon: Settings },
                      ].map((item) =>
                        item.href.includes('#') ? (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="nw-nav-mobile-link flex items-center gap-3"
                          >
                            <item.icon className="h-4 w-4 text-violet-400" />
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="nw-nav-mobile-link flex items-center gap-3"
                          >
                            <item.icon className="h-4 w-4 text-violet-400" />
                            {item.label}
                          </Link>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          logout();
                        }}
                        className="nw-nav-mobile-link flex w-full items-center gap-3 text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="nw-nav-signin nw-nav-signin-block block text-center">
                        Sign In
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="nw-nav-cta justify-center">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span className="nw-nav-cta-label">Get Started</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="site-header-spacer w-full shrink-0"
        style={{ height: headerOffsetPx }}
        aria-hidden
      />
    </>
  );
}

export default function PublicNavbar() {
  return (
    <Suspense fallback={<PublicNavbarFallback />}>
      <PublicNavbarContent />
    </Suspense>
  );
}

function PublicNavbarFallback() {
  return (
    <div
      className="site-header-spacer w-full shrink-0"
      style={{ height: PUBLIC_NAV_HEIGHT_PX }}
      aria-hidden
    />
  );
}
