'use client';

import { RefObject } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HeroScrollSignalProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

/** Visual signal beam — leaves the core on scroll and bridges toward Node 01. */
export default function HeroScrollSignal({ containerRef }: HeroScrollSignalProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const beamScale = useTransform(smooth, [0, 0.15, 0.55], [0, 0.6, 1]);
  const beamOpacity = useTransform(smooth, [0, 0.08, 0.5, 0.75], [0, 1, 1, 0]);
  const pulseY = useTransform(smooth, [0, 0.55], ['0%', '92%']);
  const pulseOpacity = useTransform(smooth, [0, 0.1, 0.45, 0.6], [0, 1, 1, 0]);
  const nodeScale = useTransform(smooth, [0.2, 0.45, 0.7], [0.5, 1, 1.2]);
  const nodeOpacity = useTransform(smooth, [0.15, 0.35, 0.65], [0, 1, 0.3]);

  return (
    <div className="nw-signal3 pointer-events-none absolute bottom-0 left-1/2 z-[5] h-[min(28vh,220px)] w-px -translate-x-1/2" aria-hidden>
      {/* Vertical energy beam */}
      <motion.div
        className="nw-signal3-beam absolute bottom-0 left-1/2 h-full w-[3px] origin-bottom -translate-x-1/2"
        style={{ scaleY: beamScale, opacity: beamOpacity }}
      />

      {/* Traveling pulse */}
      <motion.div
        className="nw-signal3-pulse absolute left-1/2 -translate-x-1/2"
        style={{ top: pulseY, opacity: pulseOpacity }}
      />

      {/* Node 01 handoff glow */}
      <motion.div
        className="nw-signal3-node absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ scale: nodeScale, opacity: nodeOpacity }}
      />

      {/* Horizontal connector toward journey path (desktop) */}
      <motion.div
        className="nw-signal3-connector absolute bottom-0 hidden lg:block"
        style={{ opacity: beamOpacity }}
      />
    </div>
  );
}
