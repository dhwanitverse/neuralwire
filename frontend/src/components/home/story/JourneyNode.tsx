'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { PREMIUM_EASE } from './motionSystem';

interface JourneyNodeProps {
  x: number;
  y: number;
  step: number;
  activeStep: number;
}

function JourneyNode({ x, y, step, activeStep }: JourneyNodeProps) {
  const isPast = step < activeStep;
  const isCurrent = step === activeStep;
  const isFuture = step > activeStep;

  return (
    <motion.g
      initial={false}
      animate={{ opacity: isFuture ? 0.28 : isPast ? 0.55 : 1 }}
      transition={{ duration: 0.35, ease: PREMIUM_EASE }}
      style={{ x, y }}
    >
      <motion.circle
        r={isCurrent ? 22 : 0}
        fill="url(#nw-node-bloom)"
        initial={false}
        animate={{ r: isCurrent ? 22 : 0, opacity: isCurrent ? 0.7 : 0 }}
        transition={{ duration: 0.35, ease: PREMIUM_EASE }}
      />

      <motion.circle
        fill="none"
        initial={false}
        animate={{
          r: isCurrent ? 15 : isPast ? 9 : 8,
          stroke: isCurrent
            ? 'rgba(34,211,238,0.45)'
            : isPast
              ? 'rgba(139,92,246,0.15)'
              : 'rgba(255,255,255,0.04)',
          strokeWidth: isCurrent ? 1.5 : 1,
          opacity: isCurrent ? 1 : isPast ? 0.6 : 0.35,
        }}
        transition={{ duration: 0.35, ease: PREMIUM_EASE }}
      />

      <motion.circle
        initial={false}
        animate={{
          r: isCurrent ? 6.5 : isPast ? 4.5 : 3.5,
          fill: isCurrent ? '#a78bfa' : isPast ? '#6d28d9' : '#050816',
          stroke: isCurrent ? '#22d3ee' : isPast ? 'rgba(34,211,238,0.35)' : 'rgba(255,255,255,0.1)',
          strokeWidth: isCurrent ? 2 : 1.5,
        }}
        transition={{ duration: 0.35, ease: PREMIUM_EASE }}
        filter={isCurrent || isPast ? 'url(#nw-node-glow)' : undefined}
      />

      {isCurrent && (
        <motion.circle
          r={2}
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: PREMIUM_EASE }}
        />
      )}
    </motion.g>
  );
}

export default memo(JourneyNode, (prev, next) => {
  const prevState =
    prev.step < prev.activeStep ? 'past' : prev.step === prev.activeStep ? 'current' : 'future';
  const nextState =
    next.step < next.activeStep ? 'past' : next.step === next.activeStep ? 'current' : 'future';
  return prevState === nextState && prev.x === next.x && prev.y === next.y;
});
