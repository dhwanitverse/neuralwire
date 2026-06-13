'use client';

import { AtSign, Share2 } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import { Blog } from '@/types';
import { AUTHOR_PROFILES } from '@/lib/brand';

interface AuthorData {
  name: string;
  avatar: string;
  count: number;
}

function aggregateAuthors(blogs: Blog[]): AuthorData[] {
  const map = new Map<string, AuthorData>();
  blogs.forEach((b) => {
    const existing = map.get(b.author);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(b.author, { name: b.author, avatar: b.authorAvatar || '', count: 1 });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 6);
}

export default function PopularAuthors({ blogs }: { blogs: Blog[] }) {
  const authors = aggregateAuthors(blogs);
  if (authors.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {authors.map((author, i) => {
        const profile = AUTHOR_PROFILES[author.name];
        return (
          <div
            key={author.name}
            className="nw-card-media group rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-violet-500/30">
                {author.avatar ? (
                  <SafeImage src={author.avatar} alt={author.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-white">{author.name}</h3>
                <p className="text-xs text-violet-400">{profile?.title || 'Contributor'}</p>
                <p className="mt-1 text-xs text-slate-500">{author.count} article{author.count !== 1 ? 's' : ''}</p>
              </div>
            </div>
            {profile?.bio && (
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-400">{profile.bio}</p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <a href={profile?.twitter || '#'} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-sky-400" aria-label="Social">
                <AtSign className="h-4 w-4" />
              </a>
              <a href={profile?.linkedin || '#'} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-blue-400" aria-label="Profile">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
