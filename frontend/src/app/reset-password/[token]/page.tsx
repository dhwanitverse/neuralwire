'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, AlertCircle, CheckCircle, Check, X, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/errors';
import AuthLayout from '@/components/layout/AuthLayout';
import PasswordField from '@/components/ui/PasswordField';
import PasswordStrength from '@/components/ui/PasswordStrength';
import Button from '@/components/ui/Button';

const REDIRECT_DELAY_MS = 3500;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError('Invalid reset link');
      setValidating(false);
      return;
    }

    api
      .get(`/auth/reset-password/${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.data?.valid === true) {
          setTokenValid(true);
        } else {
          setTokenError(res.data?.message || 'This reset link is invalid or has expired.');
        }
      })
      .catch((err) =>
        setTokenError(getApiErrorMessage(err, 'This reset link is invalid or has expired.'))
      )
      .finally(() => setValidating(false));
  }, [token]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => router.push('/login'), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [success, router]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, {
        password,
        confirmPassword,
      });
      if (res.data?.success) {
        setSuccess(true);
        toast.success('Password updated — redirecting to sign in');
        return;
      }
      toast.error(res.data?.message || 'Failed to reset password');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <AuthLayout
        title="Reset password"
        subtitle="Verifying your reset link…"
        backHref="/forgot-password"
        backLabel="Request new link"
      >
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Checking link validity…</p>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout
        eyebrow="Account recovery"
        title="Password updated"
        subtitle="Your password has been changed successfully"
        backHref="/login"
      >
        <div className="auth-success-state text-center">
          <div className="auth-success-icon auth-success-pop mx-auto">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            You can now sign in with your new password. For your security, this reset link is no
            longer valid.
          </p>
          <p className="mt-4 text-xs text-slate-600">Redirecting you to sign in…</p>

          <Link href="/login" className="auth-submit-btn mt-6 inline-flex w-full justify-center">
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (!tokenValid) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="This password reset link is no longer valid"
        backHref="/login"
      >
        <div className="text-center">
          <div className="auth-shake mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{tokenError}</p>
          <Link href="/forgot-password" className="auth-link-btn mt-6 inline-flex">
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account"
      backHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <PasswordField
            label="New password"
            icon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: '' }));
            }}
            error={errors.password}
            placeholder="Min 6 characters"
          />
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5">
          <PasswordField
            label="Confirm password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
          />
          {passwordsMatch && (
            <p className="auth-match-line text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              Passwords match
            </p>
          )}
          {passwordsMismatch && !errors.confirmPassword && (
            <p className="auth-match-line text-amber-400">
              <X className="h-3.5 w-3.5" />
              Passwords don&apos;t match yet
            </p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
