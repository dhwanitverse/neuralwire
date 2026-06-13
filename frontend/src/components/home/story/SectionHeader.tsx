'use client';

import Link from 'next/link';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
}

export default function SectionHeader({ eyebrow, title, description, href }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
      {href && (
        <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-violet-400 hover:text-violet-300">
          Explore all →
        </Link>
      )}
    </div>
  );
}
