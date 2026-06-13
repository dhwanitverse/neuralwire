'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientMountProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only after the client has mounted.
 * Prevents hydration mismatches when browser extensions inject
 * attributes (e.g. fdprocessedid) into buttons/inputs before React hydrates.
 */
export default function ClientMount({ children, fallback = null }: ClientMountProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;
  return children;
}
