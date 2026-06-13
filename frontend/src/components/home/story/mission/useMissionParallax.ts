'use client';

import { RefObject, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLightMotion } from '@/components/home/story/useLightMotion';
import { useReducedMotion } from 'framer-motion';

/** Shared mouse parallax for mission-control panels + core wrapper. */
export function useMissionParallax(containerRef: RefObject<HTMLElement | null>) {
  const light = useLightMotion();
  const reduced = useReducedMotion();
  const active = !light && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 80, damping: 24, mass: 0.35 };

  const panelX = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring);
  const panelY = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), spring);
  const coreX = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), spring);
  const coreY = useSpring(useTransform(my, [-0.5, 0.5], [-5, 5]), spring);

  useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
      my.set((e.clientY - (r.top + r.height / 2)) / r.height);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, [active, containerRef, mx, my]);

  return { active, panelX, panelY, coreX, coreY };
}
