'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PARTICLE_COUNT = 28;
const LINK_DISTANCE = 120;

export default function NeuralBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let running = true;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const initParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 1,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) initParticles();
    };

    const draw = () => {
      if (!running) return;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(animId);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full opacity-50" aria-hidden />
      <div className="nw-orb nw-orb-blue absolute left-1/4 top-1/4 h-96 w-96" />
      <div className="nw-orb nw-orb-violet absolute bottom-1/3 right-1/4 h-80 w-80" />
      <div className="nw-orb nw-orb-cyan absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
