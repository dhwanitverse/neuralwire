'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useLightMotion(): boolean {
  const reduced = useReducedMotion();
  const [light, setLight] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setLight(Boolean(reduced) || mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  return light;
}
