'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bookmark, Share2 } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';

interface CardActionsProps {
  id: string;
  title: string;
  className?: string;
}

export default function CardActions({ id, title, className = '' }: CardActionsProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(id));
    const fn = () => setSaved(isBookmarked(id));
    window.addEventListener('bookmarks-changed', fn);
    return () => window.removeEventListener('bookmarks-changed', fn);
  }, [id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleBookmark(id);
    setSaved(nowSaved);
    toast.success(nowSaved ? 'Saved to bookmarks' : 'Removed from bookmarks');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blogs/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleBookmark}
        aria-label={saved ? 'Remove bookmark' : 'Bookmark'}
        className={`rounded-lg p-2 transition-all ${
          saved ? 'bg-violet-500/20 text-violet-300' : 'text-slate-500 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      </button>
      <button
        onClick={handleShare}
        aria-label="Share"
        className="rounded-lg p-2 text-slate-500 transition-all hover:bg-white/10 hover:text-white"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
