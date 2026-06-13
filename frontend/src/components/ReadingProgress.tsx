'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 280);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="reading-progress fixed left-0 right-0 z-[45] h-[2px] origin-left bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
