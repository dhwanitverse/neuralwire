interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export default function Sparkline({ data, className = '', color = '#8b5cf6' }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-7 w-[4.5rem] ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
