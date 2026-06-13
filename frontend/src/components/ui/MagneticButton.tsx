'use client';

import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  href?: string;
}

export default function MagneticButton({ children, className = '', onClick, type = 'button', href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-block transition-transform duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <a href={href} onClick={onClick}>{inner}</a>;
  }

  return (
    <button type={type} onClick={onClick} className="border-0 bg-transparent p-0">
      {inner}
    </button>
  );
}
