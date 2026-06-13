'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Lightweight typewriter reveal — runs once on mount, skips if reduced motion. */
export function ScanReveal({
  text,
  className = '',
  speed = 28,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setShown(text.length);
      return;
    }
    if (shown >= text.length) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), speed);
    return () => clearTimeout(id);
  }, [shown, text.length, speed, reduced]);

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {!reduced && shown < text.length && (
        <span className="nw-scan-cursor" aria-hidden />
      )}
    </span>
  );
}
