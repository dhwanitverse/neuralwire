import Link from 'next/link';
import { BRAND } from '@/lib/brand';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'default' | 'lockup';
}

const sizes = {
  sm: { text: 'text-base', sub: 'text-[8px]' },
  md: { text: 'text-lg', sub: 'text-[9px]' },
  lg: { text: 'text-2xl', sub: 'text-[10px]' },
};

export default function Logo({ size = 'md', showTagline = false, variant = 'lockup' }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className="group nw-logo-lockup flex items-center">
      <div className="min-w-0 leading-none">
        <div className="flex items-baseline gap-0.5">
          <span className={`font-display ${s.text} font-bold tracking-tight text-white`}>
            Neural
          </span>
          <span className={`font-display ${s.text} font-bold tracking-tight gradient-text`}>Wire</span>
        </div>
        {(variant === 'lockup' || showTagline) && (
          <p
            className={`mt-1 font-medium uppercase tracking-[0.22em] text-slate-500 ${s.sub} ${
              showTagline ? 'normal-case tracking-widest' : ''
            }`}
          >
            {showTagline ? BRAND.tagline : 'AI Intelligence'}
          </p>
        )}
      </div>
    </Link>
  );
}
