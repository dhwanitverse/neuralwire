'use client';

import {
  RefObject,
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import { motion, useReducedMotion, useMotionValue } from 'framer-motion';
import {
  buildFluidPath,
  findPathDistAtNode,
  getActiveStep,
  getAnchorX,
  getAnchorY,
  getRelativeScrollY,
  scrollYToPathProgress,
  type NodePoint,
  type SectionMetric,
} from './journeyScroll';
import JourneyNode from './JourneyNode';

interface NeuralJourneyPathProps {
  containerRef: RefObject<HTMLDivElement | null>;
  activeStep: number;
  onProgress?: (progress: number) => void;
  onActiveStep?: (step: number) => void;
}

export default function NeuralJourneyPath({
  containerRef,
  activeStep,
  onProgress,
  onActiveStep,
}: NeuralJourneyPathProps) {
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<NodePoint[]>([]);
  const [svgHeight, setSvgHeight] = useState(0);
  const [svgWidth, setSvgWidth] = useState(0);
  const [pathLen, setPathLen] = useState(0);

  const measurePathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const pathLenRef = useRef(0);
  const metricsRef = useRef<SectionMetric[]>([]);
  const onProgressRef = useRef(onProgress);
  const onActiveStepRef = useRef(onActiveStep);
  const measureRafRef = useRef(0);
  const isMountedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const dotTrailX = useMotionValue(0);
  const dotTrailY = useMotionValue(0);

  onProgressRef.current = onProgress;
  onActiveStepRef.current = onActiveStep;

  const applyFrame = useCallback(
    (progress: number) => {
      const path = measurePathRef.current;
      const glow = glowPathRef.current;
      const core = corePathRef.current;
      const total = pathLenRef.current;
      if (!path || total <= 0) return;

      const clamped = Math.min(1, Math.max(0, progress));
      const dist = clamped * total;
      const offset = total - dist;

      if (glow) glow.style.strokeDashoffset = `${offset}`;
      if (core) core.style.strokeDashoffset = `${offset}`;

      const pt = path.getPointAtLength(dist);
      dotX.set(pt.x);
      dotY.set(pt.y);

      const trailDist = Math.max(0, dist - total * 0.018);
      const trail = path.getPointAtLength(trailDist);
      dotTrailX.set(trail.x);
      dotTrailY.set(trail.y);

      if (isMountedRef.current) {
        onProgressRef.current?.(clamped);
      }
    },
    [dotX, dotY, dotTrailX, dotTrailY]
  );

  const tick = useCallback(() => {
    const container = containerRef.current;
    const metrics = metricsRef.current;
    const total = pathLenRef.current;
    if (!container || metrics.length === 0 || total <= 0) return;

    const relativeY = getRelativeScrollY(container);
    const progress = reducedMotion ? 1 : scrollYToPathProgress(metrics, relativeY, total);
    applyFrame(progress);

    if (isMountedRef.current) {
      onActiveStepRef.current?.(getActiveStep(container));
    }
  }, [containerRef, applyFrame, reducedMotion]);

  const buildMetrics = useCallback(
    (pts: NodePoint[]) => {
      const path = measurePathRef.current;
      if (!path || pts.length === 0) return;

      const total = path.getTotalLength();
      pathLenRef.current = total;
      setPathLen(total);

      if (glowPathRef.current) {
        glowPathRef.current.style.strokeDasharray = `${total}`;
        glowPathRef.current.style.strokeDashoffset = `${total}`;
      }
      if (corePathRef.current) {
        corePathRef.current.style.strokeDasharray = `${total}`;
        corePathRef.current.style.strokeDashoffset = `${total}`;
      }

      const sampleCount = window.innerWidth < 768 ? 80 : 120;
      metricsRef.current = pts.map((p) => ({
        step: p.step,
        anchorY: p.y,
        pathDist: findPathDistAtNode(path, p.x, p.y, sampleCount),
      }));
    },
    []
  );

  const measureNow = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    setSvgWidth(width);
    setSvgHeight(height);

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>('[data-journey-step]')
    ).sort(
      (a, b) =>
        Number(a.dataset.journeyStep) - Number(b.dataset.journeyStep)
    );

    const next: NodePoint[] = sections.map((el, i) => {
      const step = Number(el.dataset.journeyStep);
      const anchor = el.querySelector<HTMLElement>('[data-journey-anchor]');
      const y = anchor
        ? getAnchorY(anchor, container)
        : el.offsetTop + Math.min(el.offsetHeight * 0.2, 100);
      const x = getAnchorX(i, width);
      return { x, y, step };
    });

    setPoints(next);
  }, [containerRef]);

  const scheduleMeasure = useCallback(() => {
    if (measureRafRef.current) return;
    measureRafRef.current = requestAnimationFrame(() => {
      measureNow();
      measureRafRef.current = 0;
    });
  }, [measureNow]);

  useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    measureNow();

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(container);

    window.addEventListener('resize', scheduleMeasure, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      if (measureRafRef.current) cancelAnimationFrame(measureRafRef.current);
    };
  }, [mounted, measureNow, scheduleMeasure, containerRef]);

  useEffect(() => {
    if (!mounted) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        tick();
        raf = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, tick]);

  const pathD = buildFluidPath(points);

  useLayoutEffect(() => {
    if (!pathD) return;
    buildMetrics(points);
  }, [pathD, points, buildMetrics]);

  useEffect(() => {
    if (!mounted || !pathD || pathLen <= 0) return;
    const id = requestAnimationFrame(() => tick());
    return () => cancelAnimationFrame(id);
  }, [mounted, pathD, pathLen, tick]);

  if (!mounted || points.length < 2 || svgHeight === 0 || !pathD) return null;

  return (
    <div
      className="nw-neural-path pointer-events-none absolute inset-0 z-0 overflow-visible"
      aria-hidden
    >
      <svg
        className="absolute left-0 top-0"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <linearGradient id="nw-neural-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={svgHeight}>
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="nw-neural-core" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={svgHeight}>
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#ddd6fe" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
          <radialGradient id="nw-node-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <filter id="nw-neural-glow" x="-80%" y="-2%" width="260%" height="104%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nw-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nw-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path ref={measurePathRef} d={pathD} fill="none" stroke="none" visibility="hidden" />

        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          ref={glowPathRef}
          d={pathD}
          fill="none"
          stroke="url(#nw-neural-line)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen > 0 ? pathLen : undefined}
          filter="url(#nw-neural-glow)"
          opacity={0.48}
        />

        <path
          ref={corePathRef}
          d={pathD}
          fill="none"
          stroke="url(#nw-neural-core)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen > 0 ? pathLen : undefined}
        />

        {points.map((p) => (
          <JourneyNode
            key={p.step}
            x={p.x}
            y={p.y}
            step={p.step}
            activeStep={activeStep}
          />
        ))}

        {!reducedMotion && (
          <g filter="url(#nw-dot-glow)">
            <motion.circle r={12} fill="#22d3ee" opacity={0.1} style={{ cx: dotTrailX, cy: dotTrailY }} />
            <motion.circle r={7} fill="#8b5cf6" opacity={0.3} style={{ cx: dotX, cy: dotY }} />
            <motion.circle r={4} fill="#22d3ee" style={{ cx: dotX, cy: dotY }} />
            <motion.circle r={1.5} fill="#ffffff" style={{ cx: dotX, cy: dotY }} />
          </g>
        )}
      </svg>
    </div>
  );
}
