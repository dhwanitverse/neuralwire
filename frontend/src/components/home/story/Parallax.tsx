'use client';

import { ReactNode, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { useLightMotion } from './useLightMotion';

/**
 * Subtle, scroll-linked vertical parallax (Apple / Stripe / Vercel style).
 *
 * Uses Framer Motion `useScroll` + `useTransform`. Because it only applies a
 * CSS `transform`, it never changes layout `offsetTop`/`offsetHeight`, so the
 * scroll-linked neural journey path stays perfectly in sync.
 *
 * Automatically disabled on mobile and when the user prefers reduced motion.
 */
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total travel in px across one viewport pass. Keep subtle (20–60). */
  distance?: number;
  /** Direction of travel; -1 reverses it (useful for layered depth). */
  direction?: 1 | -1;
  as?: 'div' | 'span';
}

export function Parallax({
  children,
  className,
  distance = 40,
  direction = 1,
  as = 'div',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const light = useLightMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const travel = distance * direction;
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  if (light) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const MotionTag = as === 'span' ? motion.span : motion.div;

  return (
    <MotionTag ref={ref} style={{ y, willChange: 'transform' }} className={className}>
      {children}
    </MotionTag>
  );
}

/**
 * Subtle pointer-driven 3D tilt that gives prominent cards a layered,
 * premium parallax feel on hover. Disabled on touch / reduced motion.
 */
interface ParallaxTiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep small (4–7) for a refined feel. */
  max?: number;
}

export function ParallaxTilt({ children, className, max = 5 }: ParallaxTiltProps) {
  const light = useLightMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 18, mass: 0.3 };
  const rotateX = useSpring(rotX, springConfig);
  const rotateY = useSpring(rotY, springConfig);

  if (light) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * max * 2);
    rotX.set(-py * max * 2);
  };

  const reset = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
