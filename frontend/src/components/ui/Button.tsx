import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'nw-btn-primary text-white active:scale-[0.98]',
  secondary: 'nw-card-premium text-slate-200 hover:bg-white/[0.08] hover:text-white',
  danger:
    'border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-[0.98]',
  ghost: 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
  outline:
    'nw-btn-ghost text-slate-200 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-sm rounded-xl',
};

export default function Button({
  children,
  loading,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
