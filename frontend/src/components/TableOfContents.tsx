'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="nw-glass sticky top-24 rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        <List className="h-4 w-4 text-violet-400" />
        On this page
      </div>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`block rounded-lg border-l-2 py-1.5 pl-3 text-sm transition-all ${
                active === h.id
                  ? 'border-violet-400 bg-violet-500/10 text-violet-300'
                  : 'border-transparent text-slate-500 hover:border-violet-500/50 hover:text-slate-300'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
