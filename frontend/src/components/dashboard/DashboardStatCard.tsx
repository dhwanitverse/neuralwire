'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Sparkline from './Sparkline';

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  sparkData: number[];
  trend?: number;
  delay?: number;
  format?: 'number' | 'percent' | 'time';
  timeLabel?: string;
}

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  gradient,
  glow,
  sparkData,
  trend = 0,
  delay = 0,
  format = 'number',
  timeLabel,
}: DashboardStatCardProps) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="dash-stat-card group"
    >
      <div className={`dash-stat-glow ${glow}`} aria-hidden />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="font-display mt-2 text-3xl font-bold tracking-tight text-white">
            {format === 'time' ? (
              timeLabel
            ) : format === 'percent' ? (
              <>
                <AnimatedCounter value={value} />
                <span className="text-xl text-slate-400">%</span>
              </>
            ) : (
              <AnimatedCounter value={value} />
            )}
          </p>
          <div className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '—'}</span>
            <span className="text-slate-600">vs last month</span>
          </div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="relative mt-4 flex items-end justify-between border-t border-white/[0.05] pt-3">
        <Sparkline data={sparkData} color={glow.includes('cyan') ? '#22d3ee' : glow.includes('amber') ? '#f59e0b' : glow.includes('emerald') ? '#34d399' : '#8b5cf6'} />
        <span className="text-[10px] text-slate-600">30d trend</span>
      </div>
    </motion.div>
  );
}
