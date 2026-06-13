'use client';

import Link from 'next/link';
import { Pencil, Trash2, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { Blog } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { estimateReadTime, formatReadTime, getArticleStatus } from '@/lib/dashboardUtils';
import SafeImage from '@/components/SafeImage';

interface ArticleTableViewProps {
  blogs: Blog[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}

export default function ArticleTableView({
  blogs,
  selected,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onDelete,
  deleting,
}: ArticleTableViewProps) {
  const allSelected = blogs.length > 0 && selected.size === blogs.length;

  return (
    <div className="dash-table-wrap hidden overflow-hidden lg:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            <th className="w-10 px-4 py-3 text-left">
              <button type="button" onClick={onToggleAll} className="text-slate-500 hover:text-white">
                {allSelected ? <CheckSquare className="h-4 w-4 text-violet-400" /> : <Square className="h-4 w-4" />}
              </button>
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Article</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Category</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Views</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Read</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Updated</th>
            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {blogs.map((blog) => {
            const status = getArticleStatus(blog);
            const readMin = estimateReadTime(blog.content);
            return (
              <tr key={blog._id} className="dash-table-row">
                <td className="px-4 py-3">
                  <button type="button" onClick={() => onToggleSelect(blog._id)} className="text-slate-500 hover:text-white">
                    {selected.has(blog._id) ? <CheckSquare className="h-4 w-4 text-violet-400" /> : <Square className="h-4 w-4" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/[0.08]">
                      <SafeImage src={blog.image} alt={blog.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium text-white">{blog.title}</p>
                      <p className="text-xs text-slate-600">{blog.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryColor(blog.category)}`}>
                    {blog.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`dash-status-badge ${status === 'published' ? 'is-published' : 'is-draft'}`}>
                    <span className="dash-status-dot" />
                    {status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{blog.views ?? 0}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatReadTime(readMin)}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatDate(blog.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <Link href={`/blogs/${blog._id}`} className="dash-action-btn" title="Preview">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button type="button" onClick={() => onEdit(blog._id)} className="dash-action-btn is-edit" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(blog._id)}
                      disabled={deleting === blog._id}
                      className="dash-action-btn is-delete"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
