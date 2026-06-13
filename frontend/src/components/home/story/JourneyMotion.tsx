'use client';

import { ReactNode } from 'react';
import { Parallax } from '@/components/home/story/Parallax';

/**
 * Wraps a section's card content with a subtle scroll parallax. Because the
 * SectionHeader is rendered outside this wrapper, only the cards drift while
 * the journey node dots stay locked to the headers.
 */
export function JourneyStagger({
  children,
  className = '',
  distance = 34,
  direction = 1,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  direction?: 1 | -1;
}) {
  return (
    <Parallax className={className} distance={distance} direction={direction}>
      {children}
    </Parallax>
  );
}

export function JourneyCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
