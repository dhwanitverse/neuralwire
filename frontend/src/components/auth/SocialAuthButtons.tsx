'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function SocialAuthButtons() {
  const { loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState<boolean | null>(null);
  const [googleMissing, setGoogleMissing] = useState<string[]>([]);

  useEffect(() => {
    api
      .get('/auth/google/status')
      .then((res) => {
        setGoogleReady(res.data?.ready === true);
        setGoogleMissing(res.data?.missing ?? []);
      })
      .catch((err) => {
        setGoogleReady(false);
        setGoogleMissing(err?.response?.data?.missing ?? ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);
      });
  }, []);

  const handleGoogle = () => {
    if (!googleReady) {
      toast.error(
        'Google Sign-In is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env, then restart the server.'
      );
      return;
    }
    setGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/8" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#050816] px-3 text-slate-500">Or continue with</span>
        </div>
      </div>

      {googleReady === false && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-100/80">
            Google Sign-In is not configured on the server.
            {googleMissing.length > 0 && (
              <span className="mt-0.5 block text-amber-200/70">
                Missing in <code className="rounded bg-black/30 px-1">backend/.env</code>:{' '}
                {googleMissing.join(', ')}
              </span>
            )}
          </p>
        </div>
      )}

      <button
        id="google-signin-btn"
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || googleReady === false}
        aria-label="Sign in with Google"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {googleLoading ? (
          <svg
            className="h-4 w-4 animate-spin text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
      </button>

      <button
        id="github-signin-btn"
        type="button"
        disabled
        aria-label="Sign in with GitHub (coming soon)"
        className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/6 bg-white/3 py-3 text-sm font-medium text-slate-500 opacity-50"
      >
        <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        GitHub (coming soon)
      </button>
    </div>
  );
}
