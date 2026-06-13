import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  image?: string;
}

export default function PageHero({ title, subtitle, children, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 mesh-bg" />
      <div className="hero-glow -left-32 top-0 h-96 w-96 bg-indigo-500/20" />
      <div className="hero-glow -right-32 bottom-0 h-80 w-80 bg-violet-500/15" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
