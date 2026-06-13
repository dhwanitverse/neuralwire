'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Mail,
  CheckCircle,
  Info,
  Shield,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/errors';
import { normalizeEmail } from '@/lib/normalizeEmail';
import AuthLayout from '@/components/layout/AuthLayout';
import InputField from '@/components/ui/InputField';

const toastOpts = {
  className: 'auth-toast',
  success: { className: 'auth-toast auth-toast-success' },
  error: { className: 'auth-toast auth-toast-error' },
};

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailType, setEmailType] = useState<'reset' | 'no-account' | 'google-signin'>('reset');
  const [smtpReady, setSmtpReady] = useState<boolean | null>(null);
  const [smtpNotice, setSmtpNotice] = useState<string | null>(null);
  const [fixInstruction, setFixInstruction] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/auth/test-email')
      .then((res) => {
        applySmtpStatus(res.data);
      })
      .catch((err) => {
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          applySmtpStatus(data);
          return;
        }
        setSmtpReady(false);
        setSmtpNotice(
          getApiErrorMessage(err, 'Could not reach the email service. Is the backend running?')
        );
      });

    function applySmtpStatus(data: {
      canSendEmail?: boolean;
      ready?: boolean;
      provider?: string;
      fixInstruction?: string;
      smtpConfigError?: string;
      message?: string;
    }) {
      const canSend = data.canSendEmail === true || data.ready === true;
      setSmtpReady(canSend);

      if (canSend) {
        setFixInstruction(null);
        setSmtpNotice(`Email service ready (${data.provider || 'SMTP'}).`);
        return;
      }

      setFixInstruction(data.fixInstruction || null);
      setSmtpNotice(
        data.smtpConfigError ||
          data.message ||
          'Email service is not configured on the server.'
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (smtpReady === false) {
      return;
    }

    const trimmed = normalizeEmail(email);

    if (!trimmed) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: trimmed });

      if (res.data?.success === true && res.data?.emailSent === true && res.data?.deliveryMode === 'smtp') {
        setSent(true);
        setEmailType((res.data.emailType as typeof emailType) || 'reset');
        toast.success('Email sent — check your inbox', toastOpts.success);
        return;
      }

      const message =
        res.data?.message ||
        (res.data?.deliveryMode === 'ethereal-preview'
          ? 'Email was not sent to a real inbox — configure SMTP in backend/.env.'
          : 'Could not send email. Check SMTP configuration in backend/.env.');
      setError(message);
      toast.error(message, toastOpts.error);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not send email. Please try again.');
      setError(message);
      if (smtpReady !== false) {
        toast.error(message, toastOpts.error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        eyebrow="Account recovery"
        title="Check your email"
        subtitle={
          emailType === 'no-account'
            ? 'We sent instructions to your email address'
            : emailType === 'google-signin'
              ? 'We sent Google Sign-In instructions to your email'
              : 'Password reset instructions are on the way'
        }
        backHref="/login"
      >
        <div className="auth-success-state text-center">
          <div className="auth-success-icon auth-success-pop mx-auto">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            {emailType === 'no-account' ? (
              <>
                We sent next steps to <span className="font-medium text-white">{email}</span>.
              </>
            ) : emailType === 'google-signin' ? (
              <>
                We sent Google Sign-In instructions to{' '}
                <span className="font-medium text-white">{email}</span>.
              </>
            ) : (
              <>
                We sent a secure reset link to{' '}
                <span className="font-medium text-white">{email}</span>. It expires in 20 minutes.
              </>
            )}
          </p>
          <p className="mt-4 text-xs text-slate-600">
            Check your inbox and spam folder if you do not see the email within a few minutes.
          </p>

          <Link href="/login" className="auth-submit-btn mt-6 inline-flex w-full justify-center">
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="auth-trust-line mt-6">
          <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
          Reset links are single-use and expire automatically for your security.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset password"
      subtitle="Enter your email and we'll send you instructions"
      backHref="/login"
    >
      {smtpReady === false && smtpNotice && (
        <div className="auth-dev-banner mb-5 text-left">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Email service not configured</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/80">{smtpNotice}</p>
            {fixInstruction && (
              <p className="mt-2 text-xs leading-relaxed text-amber-100/70">{fixInstruction}</p>
            )}
            <p className="mt-2 text-[11px] text-amber-200/60">
              File: <code className="rounded bg-black/30 px-1">backend/.env</code> → variable:{' '}
              <code className="rounded bg-black/30 px-1">EMAIL_PASSWORD</code>
            </p>
          </div>
        </div>
      )}

      {smtpReady === true && smtpNotice && (
        <div className="auth-notice auth-notice-success mb-5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-slate-400">{smtpNotice}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-[1] space-y-5">
        <InputField
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoComplete="email"
          hint="We'll email you reset instructions or next steps for this address"
        />

        <button
          type="submit"
          disabled={loading || smtpReady !== true}
          className="auth-submit-btn w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {smtpReady === false ? (
            <>
              <Sparkles className="h-4 w-4" />
              Email service not ready
            </>
          ) : loading ? (
            <>
              <span className="auth-submit-spinner" aria-hidden />
              Sending email…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Send email
              <ArrowRight className="h-4 w-4 opacity-80" />
            </>
          )}
        </button>
      </form>

      <p className="auth-trust-line mt-6">
        <Shield className="h-3.5 w-3.5 shrink-0 text-violet-400/80" />
        Secure 256-bit encrypted reset flow · Link expires in 20 minutes
      </p>

      <div className="auth-footer-links mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-center text-sm">
        <p className="text-slate-500">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
            Sign in
          </Link>
        </p>
        <p className="text-slate-600">
          No account yet?{' '}
          <Link href="/register" className="font-medium text-slate-400 transition-colors hover:text-white">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
