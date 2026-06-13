'use client';

import { useEffect, useRef } from 'react';

/** Cursor follow glow — updates DOM directly (no React state per mousemove). */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let visible = false;

    const move = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
        if (!visible) {
          visible = true;
          el.style.opacity = '1';
        }
        raf = 0;
      });
    };

    const leave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[9997] h-[400px] w-[400px] opacity-0 mix-blend-screen transition-opacity duration-300 will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
      }}
      aria-hidden
    />
  );
}
