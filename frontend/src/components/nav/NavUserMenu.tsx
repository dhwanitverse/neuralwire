'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function NavAvatar({ name, profilePicture, size = 'md' }: { name?: string; profilePicture?: string | null; size?: 'sm' | 'md' }) {
  const [imgError, setImgError] = useState(false);
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs';

  if (profilePicture && !imgError) {
    return (
      <Image
        src={profilePicture}
        alt={name ?? 'User avatar'}
        width={36}
        height={36}
        className={`${dim} rounded-lg object-cover ring-2 ring-violet-500/30`}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-violet-600 to-cyan-500 ${text} font-bold text-white ring-2 ring-violet-500/25`}
    >
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  );
}

interface NavUserMenuProps {
  variant?: 'public' | 'dashboard';
  onNavigate?: () => void;
  showName?: boolean;
}

export default function NavUserMenu({ variant = 'public', onNavigate, showName = true }: NavUserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    onNavigate?.();
  };

  const triggerClass = variant === 'dashboard' ? 'dash-topbar-profile' : 'nw-nav-avatar-trigger';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <NavAvatar name={user?.name} profilePicture={user?.profilePicture} size={variant === 'dashboard' ? 'sm' : 'md'} />
        {showName && (
          <span className="hidden max-w-[5.5rem] truncate text-xs font-medium text-slate-200 lg:inline">
            {user?.name?.split(' ')[0]}
          </span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="nw-nav-dropdown"
            role="menu"
          >
            <div className="border-b border-white/[0.06] px-3 py-3">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
            </div>
            <div className="p-1.5">
              {[
                { href: '/dashboard', label: 'Profile', icon: User },
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/dashboard#settings', label: 'Settings', icon: Settings },
              ].map((item) =>
                item.href.includes('#') ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="nw-nav-dropdown-item"
                    role="menuitem"
                  >
                    <item.icon className="h-4 w-4 text-violet-400" />
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="nw-nav-dropdown-item"
                    role="menuitem"
                  >
                    <item.icon className="h-4 w-4 text-violet-400" />
                    {item.label}
                  </Link>
                )
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                  onNavigate?.();
                }}
                className="nw-nav-dropdown-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { NavAvatar };
