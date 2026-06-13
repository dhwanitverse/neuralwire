'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import InputField from '@/components/ui/InputField';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';

const REMEMBER_KEY = 'neuralwire_remember_email';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Required';
    if (!password) errs.password = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(email, password);
      if (remember) localStorage.setItem(REMEMBER_KEY, email);
      else localStorage.removeItem(REMEMBER_KEY);
      toast.success('Welcome back to NeuralWire!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your NeuralWire account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField label="Email" type="email" icon={Mail} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <div>
          <PasswordField label="Password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/30"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-violet-400 transition-colors hover:text-violet-300">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
      </form>
      <div className="mt-6"><SocialAuthButtons /></div>
      <p className="mt-6 text-center text-sm text-slate-500">
        No account? <Link href="/register" className="font-semibold text-violet-400 hover:text-violet-300">Create one</Link>
      </p>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
