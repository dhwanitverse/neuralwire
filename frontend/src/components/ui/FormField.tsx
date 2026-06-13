import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
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

type FormFieldProps = InputProps | TextareaProps | SelectProps;

const fieldClasses =
  'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10';

export default function FormField(props: FormFieldProps) {
  const { label, error, hint } = props;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {props.as === 'textarea' ? (
        (() => {
          const { label: _, error: __, hint: ___, as: ____, ...rest } = props;
          return (
            <textarea
              {...rest}
              className={`${fieldClasses} min-h-[140px] resize-y ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : ''}`}
            />
          );
        })()
      ) : props.as === 'select' ? (
        (() => {
          const { label: _, error: __, hint: ___, as: ____, options, ...rest } = props;
          return (
            <select
              {...rest}
              className={`${fieldClasses} ${error ? 'border-red-300' : ''}`}
            >
              <option value="">Select a category</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })()
      ) : (
        (() => {
          const { label: _, error: __, hint: ___, as: ____, ...rest } = props;
          return (
            <input
              {...rest}
              className={`${fieldClasses} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : ''}`}
            />
          );
        })()
      )}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
