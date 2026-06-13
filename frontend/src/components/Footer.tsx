'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { IconGitHub, IconLinkedIn, IconX } from '@/components/icons/SocialIcons';
import Logo from '@/components/Logo';
import { BRAND } from '@/lib/brand';

const groups = {
  Platform: [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Articles' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  Topics: [
    { href: '/blogs?category=Artificial Intelligence', label: 'AI & ML' },
    { href: '/blogs?category=Tech News', label: 'Startups' },
    { href: '/blogs?category=Cyber Security', label: 'Security' },
    { href: '/blogs?category=Cloud Computing', label: 'Cloud' },
  ],
  Account: [
    { href: '/login', label: 'Sign In' },
    { href: '/register', label: 'Register' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
};

const social = [
  { href: '#', Icon: IconX, label: 'X' },
  { href: '#', Icon: IconGitHub, label: 'GitHub' },
  { href: '#', Icon: IconLinkedIn, label: 'LinkedIn' },
];

const hiddenPaths = ['/login', '/register', '/forgot-password'];

export default function Footer() {
  const pathname = usePathname();
  if (
    hiddenPaths.includes(pathname) ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/auth/')
  ) {
    return null;
  }

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#030712] text-slate-400">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="glow-orb left-1/2 top-0 h-40 w-[32rem] -translate-x-1/2 bg-violet-600/8" />

      {/* CTA strip */}
      <div className="border-b border-white/[0.05] bg-gradient-to-r from-blue-500/[0.04] via-violet-500/[0.06] to-cyan-500/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-lg font-semibold text-white">Stay ahead of the curve</p>
            <p className="mt-1 text-sm text-slate-500">Daily AI & tech intelligence, free in your inbox.</p>
          </div>
          <a
            href="/#journey-newsletter"
            className="nw-btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            Subscribe free <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="md" showTagline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">{BRAND.description}</p>
            <div className="mt-6 flex gap-2">
              {social.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(groups).map(([title, items]) => (
            <div key={title} className="lg:col-span-2">
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-300">
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-sm text-slate-500 transition-colors hover:text-violet-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider mt-14" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {BRAND.name} Media. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Breaking AI, Technology &amp; Innovation News</p>
        </div>
      </div>
    </footer>
  );
}
