'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

/**
 * /auth/callback
 *
 * The Express backend redirects here after a successful Google OAuth round-trip:
 *   /api/auth/google/callback  →  /auth/callback?token=<JWT>
 *
 * On error:
 *   /api/auth/google/callback  →  /auth/callback?error=<message>
 *
 * This page:
 *  1. Reads the token (or error) from the URL
 *  2. Stores the token in localStorage
 *  3. Fetches /auth/me to hydrate the React user state
 *  4. Redirects to /dashboard on success, /login on failure
 */
function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, refreshUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-invoke
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace('/login');
      return;
    }

    if (!token) {
      toast.error('Authentication failed — no token received.');
      router.replace('/login');
      return;
    }

    // Store the JWT then fetch the user profile to hydrate state
    localStorage.setItem('token', token);

    refreshUser()
      .then(() => {
        toast.success('Signed in with Google!');
        router.replace('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        logout();
        toast.error('Session could not be verified. Please try again.');
        router.replace('/login');
      });
  }, [searchParams, router, logout, refreshUser]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#030712]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_65%)]" />
      <div className="nw-card-premium flex flex-col items-center gap-6 rounded-2xl px-10 py-12">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/10 border-t-violet-500" />
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-white">Completing sign-in</p>
          <p className="mt-1.5 text-sm text-slate-500">Verifying your Google account</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050816]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-violet-500" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
