'use client';

import { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  placeholder?: string;
}

export default function PasswordField({
  label,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  placeholder = 'Enter your password',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        )}
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-dark w-full rounded-xl border bg-white/5 py-3 text-sm text-white backdrop-blur-sm transition-all placeholder:text-slate-500 hover:border-white/20 focus:border-indigo-500 focus:bg-white/8 focus:outline-none ${
            Icon ? 'pl-11 pr-12' : 'px-4 pr-12'
          } ${error ? 'border-red-500/50' : 'border-white/10'}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-all hover:bg-white/10 hover:text-slate-300"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <span key={visible ? 'hide' : 'show'} className="inline-block animate-[fade-in_0.2s_ease]">
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </span>
        </button>
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
