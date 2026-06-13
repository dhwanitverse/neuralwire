'use client';

import { CATEGORIES } from '@/lib/utils';

interface CategoryChipsProps {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryChips({ active, onChange }: CategoryChipsProps) {
  const chips = ['', ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {chips.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat || 'all'}
            onClick={() => onChange(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat || 'All Topics'}
          </button>
        );
      })}
    </div>
  );
}
