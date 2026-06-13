'use client';

import toast from 'react-hot-toast';
import { Share2, Link2, AtSign, Bookmark } from 'lucide-react';
import { toggleBookmark, isBookmarked } from '@/lib/bookmarks';
import { useEffect, useState } from 'react';

export default function ShareSidebar({ id, title }: { id: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(id));
  }, [id]);

  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/blogs/${id}`);
    toast.success('Link copied');
  };

  const share = async () => {
    const url = `${window.location.origin}/blogs/${id}`;
    if (navigator.share) await navigator.share({ title, url });
    else await copy();
  };

  const bookmark = () => {
    setSaved(toggleBookmark(id));
    toast.success(saved ? 'Removed bookmark' : 'Saved to bookmarks');
  };

  const actions = [
    { icon: Share2, label: 'Share', onClick: share },
    { icon: Link2, label: 'Copy link', onClick: copy },
    { icon: Bookmark, label: saved ? 'Saved' : 'Bookmark', onClick: bookmark, active: saved },
  ];

  return (
    <div className="nw-glass sticky top-24 hidden rounded-2xl p-4 xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Share</p>
      <div className="flex flex-col gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              a.active ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <a.icon className={`h-4 w-4 ${a.active ? 'fill-current' : ''}`} />
            {a.label}
          </button>
        ))}
      </div>
      <div className="mt-4 border-t border-white/8 pt-4">
        <button onClick={share} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
          <AtSign className="h-4 w-4" /> Share article
        </button>
      </div>
    </div>
  );
}
