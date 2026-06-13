'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dark?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search articles...',
  dark = true,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-dark w-full rounded-xl py-3.5 pl-11 pr-11 text-sm transition-all focus:outline-none ${
          dark
            ? 'border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-500'
            : 'border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-slate-400 transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
