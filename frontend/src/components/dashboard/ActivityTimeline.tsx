'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, PenLine, Eye, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: 'publish' | 'edit' | 'view';
  views: number;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  onCreateClick?: () => void;
}

export default function ActivityTimeline({ items, onCreateClick }: ActivityTimelineProps) {
  if (!items.length) {
    return (
      <div className="dash-activity-empty">
        <div className="dash-activity-empty-icon">
          <Sparkles className="h-6 w-6 text-violet-400" />
        </div>
        <h4 className="font-display text-base font-semibold text-white">No activity yet</h4>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Your publishing timeline will appear here once you start creating stories.
        </p>
        <Link href="/dashboard/create" onClick={onCreateClick} className="dash-btn-primary mt-5 inline-flex items-center gap-2">
          <PenLine className="h-4 w-4" />
          Create your first article
        </Link>
      </div>
    );
  }

  return (
    <ul className="dash-timeline">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
          className="dash-timeline-item"
        >
          <div className="dash-timeline-node">
            <FileText className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1 pb-5">
            <p className="line-clamp-1 text-sm font-medium text-slate-200">{item.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span>Updated {formatDate(item.date)}</span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {item.views} views
              </span>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
