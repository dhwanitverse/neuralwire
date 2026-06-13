/** Viewport line used for scroll ↔ path sync and active-section detection */
export const JOURNEY_VIEWPORT_RATIO = 0.38;

export interface SectionMetric {
  step: number;
  anchorY: number;
  pathDist: number;
}

export interface NodePoint {
  x: number;
  y: number;
  step: number;
}

export function getAnchorY(anchor: HTMLElement, container: HTMLElement): number {
  const anchorRect = anchor.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return anchorRect.top - containerRect.top;
}

/** Catmull-Rom spline — fluid zig-zag without sharp corners */
export function buildFluidPath(points: NodePoint[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    const [a, b] = points;
    const midY = (a.y + b.y) / 2;
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${a.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[Math.max(0, i - 2)];
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[Math.min(points.length - 1, i + 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function getAnchorX(index: number, width: number): number {
  if (width < 768) {
    const base = 28;
    const sway = 20;
    return index % 2 === 0 ? base : base + sway;
  }
  const inset = Math.max(100, width * 0.12);
  const left = inset;
  const right = width - inset;
  const center = width * 0.5;
  if (index === 0) return center;
  return index % 2 === 1 ? right : left;
}

export function findPathDistAtNode(
  path: SVGPathElement,
  x: number,
  y: number,
  samples = 280
): number {
  const total = path.getTotalLength();
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= samples; i++) {
    const len = (i / samples) * total;
    const p = path.getPointAtLength(len);
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = len;
    }
  }
  return best;
}

export function scrollYToPathProgress(
  metrics: SectionMetric[],
  relativeScrollY: number,
  totalPathLen: number
): number {
  if (metrics.length === 0 || totalPathLen <= 0) return 0;

  const first = metrics[0];
  const last = metrics[metrics.length - 1];

  if (relativeScrollY <= 0) return 0;

  if (relativeScrollY < first.anchorY) {
    const t = first.anchorY > 0 ? relativeScrollY / first.anchorY : 0;
    return (t * first.pathDist) / totalPathLen;
  }

  if (relativeScrollY >= last.anchorY) {
    const remaining = totalPathLen - last.pathDist;
    const tail = Math.max(last.anchorY * 0.15, 80);
    const overshoot = Math.min(relativeScrollY - last.anchorY, tail);
    const t = tail > 0 ? overshoot / tail : 1;
    return (last.pathDist + t * remaining) / totalPathLen;
  }

  for (let i = 0; i < metrics.length - 1; i++) {
    const a = metrics[i];
    const b = metrics[i + 1];
    if (relativeScrollY >= a.anchorY && relativeScrollY <= b.anchorY) {
      const span = b.anchorY - a.anchorY;
      const t = span > 0 ? (relativeScrollY - a.anchorY) / span : 0;
      const dist = a.pathDist + t * (b.pathDist - a.pathDist);
      return dist / totalPathLen;
    }
  }

  return 1;
}

export function getRelativeScrollY(container: HTMLElement): number {
  const viewportLine = window.scrollY + window.innerHeight * JOURNEY_VIEWPORT_RATIO;
  const containerTop = container.getBoundingClientRect().top + window.scrollY;
  return viewportLine - containerTop;
}

/** Pick the section whose anchor is closest to the viewport focus line */
export function getActiveStep(container: HTMLElement): number {
  const targetY = window.innerHeight * JOURNEY_VIEWPORT_RATIO;
  const anchors = container.querySelectorAll<HTMLElement>('[data-journey-anchor]');
  let bestStep = 0;
  let bestDist = Infinity;

  anchors.forEach((anchor) => {
    const section = anchor.closest<HTMLElement>('[data-journey-step]');
    if (!section) return;
    const step = Number(section.dataset.journeyStep);
    if (Number.isNaN(step)) return;
    const rect = anchor.getBoundingClientRect();
    const anchorY = rect.top + rect.height * 0.5;
    const dist = Math.abs(anchorY - targetY);
    if (dist < bestDist) {
      bestDist = dist;
      bestStep = step;
    }
  });

  return bestStep;
}

/** Premium easing — no spring, used only for section reveal (not scroll) */
export const JOURNEY_EASE = [0.22, 1, 0.36, 1] as const;
