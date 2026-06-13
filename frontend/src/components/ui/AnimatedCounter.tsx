'use client';

import { useEffect, useState } from 'react';
import { useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (v) => setShown(String(v)));
    return unsubscribe;
  }, [value, spring, display]);

  return <span>{shown}</span>;
}
