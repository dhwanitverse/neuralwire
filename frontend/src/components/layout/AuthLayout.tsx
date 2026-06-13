'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import IntelligenceMap from '@/components/home/IntelligenceMap';
import { BRAND } from '@/lib/brand';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
}

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Bank-grade encryption on every reset link' },
  { icon: Zap, text: 'Secure tokens that expire automatically in 20 minutes' },
  { icon: Sparkles, text: 'Trusted by 50,000+ builders shaping the future' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AuthLayout({
  children,
  title,
  subtitle,
  eyebrow,
  backHref,
  backLabel = 'Back to sign in',
}: AuthLayoutProps) {
  return (
    <div className="auth-shell flex min-h-dvh bg-[var(--nw-bg)]">
      {/* ── Left brand storytelling panel ── */}
      <div className="auth-hero hidden lg:flex lg:w-[50%] xl:w-[52%]">
        <div className="auth-neural-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="auth-hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="auth-orb auth-orb-1 pointer-events-none" aria-hidden />
        <div className="auth-orb auth-orb-2 pointer-events-none" aria-hidden />

        <div className="auth-hero-inner relative flex min-h-dvh w-full flex-col px-8 py-8 xl:px-14 xl:py-10">
          <Logo size="lg" variant="lockup" />

          <div className="flex flex-1 flex-col justify-center py-6">
            <motion.div initial="hidden" animate="show" variants={containerVariants}>
              <motion.span variants={itemVariants} className="auth-hero-badge">
                <span className="auth-hero-badge-dot" />
                Account recovery
              </motion.span>

              <motion.h2
                variants={itemVariants}
                className="font-display mt-5 max-w-lg text-3xl font-bold leading-[1.1] tracking-tight text-white xl:text-[2.5rem]"
              >
                Intelligence for the people building the future.
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 xl:text-base"
              >
                {BRAND.description}
              </motion.p>

              <motion.ul variants={itemVariants} className="mt-7 space-y-3">
                {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="auth-hero-feature">
                    <span className="auth-hero-feature-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={itemVariants} className="auth-map-frame mt-8 xl:mt-9">
                <IntelligenceMap compact />
              </motion.div>
            </motion.div>
          </div>

          <p className="shrink-0 text-xs text-slate-600">
            © NeuralWire · Technology Intelligence Platform
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel relative flex min-h-dvh w-full flex-1 flex-col overflow-y-auto lg:w-[50%] xl:w-[48%]">
        <div className="auth-panel-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="auth-panel-glow auth-panel-glow-a pointer-events-none absolute" aria-hidden />
        <div className="auth-panel-glow auth-panel-glow-b pointer-events-none absolute" aria-hidden />

        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px]"
          >
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo size="md" variant="lockup" />
            </div>

            <div className="auth-form-card">
              <div className="auth-form-card-shine pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden />
              <div className="auth-form-card-border pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden />

              <div className="relative">
                {backHref && (
                  <Link href={backHref} className="auth-back-link">
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                  </Link>
                )}

                {eyebrow && <p className="auth-eyebrow">{eyebrow}</p>}

                <h1 className="auth-title">{title}</h1>
                <p className="auth-subtitle">{subtitle}</p>

                <div className="auth-form-body relative z-[1]">{children}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
