'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, Loader2, Zap, Shield, Bell } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import ClientMount from '@/components/ui/ClientMount';

const BENEFITS = [
  { icon: Zap, text: 'Breaking AI news before it hits mainstream' },
  { icon: Shield, text: 'Curated by senior technology journalists' },
  { icon: Bell, text: 'Weekly digest — zero spam, unsubscribe anytime' },
];

interface NewsletterProps {
  id?: string;
  embedded?: boolean;
}

export default function Newsletter({ id, embedded }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success(`Welcome to ${BRAND.name}! Check your inbox.`);
    setEmail('');
    setLoading(false);
  };

  const inner = (
    <div className="nw-surface-card overflow-hidden rounded-3xl border border-white/[0.08] p-8 sm:p-12">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20 ring-1 ring-white/20">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Newsletter</p>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          The intelligence briefing for builders
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
          Join 50,000+ leaders who start their day with {BRAND.name}.
        </p>
      </div>

      <ClientMount
        fallback={
          <div className="nw-ai-search mx-auto mt-8 flex max-w-xl flex-col gap-2 p-2 sm:flex-row" aria-hidden>
            <div className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-600">you@company.com</div>
            <div className="nw-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold opacity-60">
              Subscribe
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="nw-ai-search mx-auto mt-8 flex max-w-xl flex-col gap-2 p-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="nw-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing…</> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </ClientMount>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.text} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
              <b.icon className="h-4 w-4 text-violet-400" />
            </div>
            <p className="text-left text-xs leading-relaxed text-slate-500">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) return <div id={id}>{inner}</div>;

  return (
    <section id={id} className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--nw-surface)] py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">{inner}</div>
    </section>
  );
}
