'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import InputField from '@/components/ui/InputField';
import PasswordField from '@/components/ui/PasswordField';
import Button from '@/components/ui/Button';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Required';
    if (!email) errs.email = 'Required';
    if (!password) errs.password = 'Required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Welcome to NeuralWire!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join NeuralWire" subtitle="Start publishing in under a minute">
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField label="Full name" icon={User} placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <InputField label="Email" type="email" icon={Mail} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField label="Password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} hint="At least 6 characters" placeholder="Min 6 characters" />
        <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
      </form>
      <div className="mt-6"><SocialAuthButtons /></div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Have an account? <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
