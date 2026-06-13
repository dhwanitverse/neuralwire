'use client';

import { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { Blog } from '@/types';

interface FeaturedShowcaseProps {
  items: Blog[];
  mode?: 'editorial' | 'magazine';
}

export default function FeaturedShowcase({
  items,
  mode = 'editorial',
}: FeaturedShowcaseProps) {
  const [featuredId, setFeaturedId] = useState(items[0]?._id ?? '');

  useEffect(() => {
    if (items.length && !items.find((b) => b._id === featuredId)) {
      setFeaturedId(items[0]._id);
    }
  }, [items, featuredId]);

  if (!items.length) return null;

  const featured = items.find((b) => b._id === featuredId) ?? items[0];
  const supporting = items.filter((b) => b._id !== featured._id);

  return (
    <div
      className={
        mode === 'magazine'
          ? 'grid gap-6 lg:grid-cols-2 lg:items-start'
          : 'grid gap-6 lg:grid-cols-5 lg:items-start'
      }
    >
      <div className={mode === 'magazine' ? 'min-w-0' : 'min-w-0 lg:col-span-3'}>
        <BlogCard blog={featured} variant="featured" />
      </div>

      {supporting.length > 0 && (
        <div className={`grid gap-4 ${mode === 'magazine' ? 'min-w-0' : 'min-w-0 lg:col-span-2'}`}>
          {supporting.slice(0, mode === 'magazine' ? 4 : 3).map((b) => (
            <div
              key={b._id}
              onClick={() => setFeaturedId(b._id)}
              className="cursor-pointer rounded-2xl ring-1 ring-transparent transition hover:ring-violet-500/30"
            >
              <BlogCard blog={b} variant={mode === 'magazine' ? 'editor' : 'compact'} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
