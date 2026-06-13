import type { Transition, Variants } from 'framer-motion';

export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export const PREMIUM_TRANSITION: Transition = {
  duration: 0.7,
  ease: PREMIUM_EASE,
};

export const JOURNEY_VIEWPORT = {
  once: false,
  amount: 0.35,
} as const;

export function getSectionVariant(light: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: light ? 36 : 80,
      scale: 0.96,
      filter: light ? 'blur(0px)' : 'blur(12px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: light ? 0.55 : 0.75,
        ease: PREMIUM_EASE,
      },
    },
    exit: {
      opacity: 0.55,
      y: light ? -12 : -24,
      scale: 0.98,
      filter: light ? 'blur(0px)' : 'blur(4px)',
      transition: { duration: 0.5, ease: PREMIUM_EASE },
    },
  };
}

export const containerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export function getItemVariant(light: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: light ? 20 : 40,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: light ? 0.5 : 0.65,
        ease: PREMIUM_EASE,
      },
    },
  };
}

export function getCardVariant(light: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      y: light ? 24 : 48,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: light ? 0.55 : 0.7,
        ease: PREMIUM_EASE,
      },
    },
  };
}

export const headingVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
};

export const subheadingVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE, delay: 0.08 },
  },
};

export const showcaseSwap = {
  initial: { opacity: 0, x: 72, scale: 0.97, filter: 'blur(8px)' },
  animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, x: -72, scale: 0.97, filter: 'blur(8px)' },
  transition: { duration: 0.55, ease: PREMIUM_EASE },
};

export const showcaseSwapLight = {
  initial: { opacity: 0, x: 32, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -32, scale: 0.98 },
  transition: { duration: 0.45, ease: PREMIUM_EASE },
};
