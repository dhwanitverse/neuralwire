import { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  title,
  subtitle,
  icon: Icon,
  iconBg = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''}`}>
      {Icon && (
        <div
          className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${align === 'center' ? 'mx-auto' : ''}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      )}
      <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-slate-500 ${align === 'center' ? 'mx-auto max-w-lg' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
