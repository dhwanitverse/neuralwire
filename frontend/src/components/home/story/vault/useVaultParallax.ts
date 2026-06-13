'use client';

import { RefObject, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useLightMotion } from '@/components/home/story/useLightMotion';

export function useVaultParallax(containerRef: RefObject<HTMLElement | null>) {
  const light = useLightMotion();
  const reduced = useReducedMotion();
  const active = !light && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 70, damping: 22, mass: 0.4 };

  const innerX = useSpring(useTransform(mx, [-0.5, 0.5], [14, -14]), spring);
  const innerY = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring);
  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [-20, 20]), spring);
  const glowY = useSpring(useTransform(my, [-0.5, 0.5], [-16, 16]), spring);
  const sceneRotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), spring);
  const sceneRotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), spring);

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

  return { active, innerX, innerY, glowX, glowY, sceneRotateX, sceneRotateY };
}
