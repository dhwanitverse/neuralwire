'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  as: 'select';
  options: { value: string; label: string }[];
}

type InputFieldProps = InputProps | TextareaProps | SelectProps;

const fieldBase =
  'input-dark w-full rounded-xl border border-white/[0.09] bg-white/[0.04] text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all placeholder:text-slate-500 hover:border-white/15 hover:bg-white/[0.06] focus:border-violet-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/20';

export default function InputField(props: InputFieldProps) {
  const { label, error, hint, icon: Icon } = props;
  const isSelect = props.as === 'select';
  const isTextarea = props.as === 'textarea';
  const padL = Icon ? 'pl-11' : 'px-4';
  const errCls = error ? 'border-red-500/50 focus:border-red-500' : '';

  const renderField = (): ReactNode => {
    if (isTextarea) {
      const { label: _, error: __, hint: ___, icon: ____, as: _____, ...rest } = props;
      return (
        <textarea
          {...rest}
          className={`${fieldBase} ${padL} pr-4 min-h-[140px] resize-y py-3 ${errCls}`}
        />
      );
    }
    if (isSelect) {
      const { label: _, error: __, hint: ___, icon: ____, as: _____, options, ...rest } = props;
      return (
        <select
          {...rest}
          className={`${fieldBase} h-12 ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 leading-normal appearance-none cursor-pointer ${errCls} ${!rest.value ? 'text-slate-500' : 'text-white'}`}
        >
          <option value="" className="bg-slate-900 text-slate-400">
            Select category
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-slate-900 text-white">
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    const { label: _, error: __, hint: ___, icon: ____, as: _____, ...rest } = props;
    return <input {...rest} className={`${fieldBase} ${padL} pr-4 py-3 ${errCls}`} />;
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`pointer-events-none absolute left-3.5 z-10 h-4 w-4 text-slate-500 ${
              isTextarea ? 'top-3.5' : 'top-1/2 -translate-y-1/2'
            }`}
          />
        )}
        {renderField()}
        {isSelect && (
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
