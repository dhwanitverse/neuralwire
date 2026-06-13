'use client';

import Link from 'next/link';
import { Pencil, Trash2, ExternalLink, Eye, Clock } from 'lucide-react';
import { Blog } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { estimateReadTime, formatReadTime, getArticleStatus } from '@/lib/dashboardUtils';
import SafeImage from '@/components/SafeImage';

interface ArticleGridViewProps {
  blogs: Blog[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
  className?: string;
}

export default function ArticleGridView({
  blogs,
  onEdit,
  onDelete,
  deleting,
  className = '',
}: ArticleGridViewProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {blogs.map((blog) => {
        const status = getArticleStatus(blog);
        const readMin = estimateReadTime(blog.content);
        return (
          <article key={blog._id} className="dash-article-card group">
            <div className="relative aspect-[16/9] overflow-hidden">
              <SafeImage src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
              <span className={`absolute left-3 top-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </span>
              <span className={`absolute right-3 top-3 dash-status-badge ${status === 'published' ? 'is-published' : 'is-draft'}`}>
                <span className="dash-status-dot" />
                {status === 'published' ? 'Live' : 'Draft'}
              </span>
            </div>
            <div className="p-4">
              <h4 className="line-clamp-2 font-medium text-white">{blog.title}</h4>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{blog.views ?? 0}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatReadTime(readMin)}</span>
                <span>{formatDate(blog.updatedAt)}</span>
              </div>
              <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
                <Link href={`/blogs/${blog._id}`} className="dash-card-action flex-1">
                  <ExternalLink className="h-3.5 w-3.5" /> Preview
                </Link>
                <button type="button" onClick={() => onEdit(blog._id)} className="dash-card-action is-edit flex-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(blog._id)}
                  disabled={deleting === blog._id}
                  className="dash-card-action is-delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
