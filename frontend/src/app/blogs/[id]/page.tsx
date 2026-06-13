'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Calendar, ArrowLeft, Clock, Share2, Link2, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Blog } from '@/types';
import { formatDate, getReadingTime, extractHeadings, getCategoryColor } from '@/lib/utils';
import { AUTHOR_PROFILES } from '@/lib/brand';
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/ui/BlogCardSkeleton';
import SafeImage from '@/components/SafeImage';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import Newsletter from '@/components/Newsletter';
import CardActions from '@/components/CardActions';
import ArticleReactions from '@/components/ArticleReactions';
import ShareSidebar from '@/components/ShareSidebar';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.get(`/blogs/${id}`), api.get(`/blogs/${id}/related`)])
      .then(([b, r]) => { setBlog(b.data.data); setRelated(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const share = async (platform?: string) => {
    if (!blog) return;
    const url = `${window.location.origin}/blogs/${blog._id}`;
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
      return;
    }
    if (navigator.share) await navigator.share({ title: blog.title, url });
    else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="skeleton mb-8 h-[50vh] min-h-[360px] rounded-3xl" />
        <div className="skeleton mx-auto h-8 max-w-lg rounded-lg" />
        <div className="skeleton mx-auto mt-6 h-64 max-w-3xl rounded-2xl" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--nw-bg)]">
        <h1 className="font-display text-2xl font-bold text-white">Story not found</h1>
        <Link href="/blogs" className="mt-4 text-violet-400 hover:text-violet-300">← Back to intelligence feed</Link>
      </div>
    );
  }

  const readTime = getReadingTime(blog.content);
  const headings = extractHeadings(blog.content);
  const authorProfile = AUTHOR_PROFILES[blog.author];
  const nextArticle = related[0];

  return (
    <article className="bg-[var(--nw-bg)]">
      <ReadingProgress />

      <header className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
          <Link href="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Intelligence feed
          </Link>
          <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>
          <h1 className="font-display mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">{blog.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(blog.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{readTime} min read</span>
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-0 sm:px-6">
          <div className="relative aspect-[21/9] max-h-[420px] overflow-hidden rounded-t-3xl border border-b-0 border-white/[0.08]">
            <SafeImage src={blog.image} alt={blog.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 xl:grid-cols-[200px_1fr_220px]">
          <aside className="hidden xl:block">
            <div className="sticky top-[calc(var(--site-header-offset)+24px)]">
              <ShareSidebar id={blog._id} title={blog.title} />
            </div>
          </aside>

          <div className="min-w-0 max-w-3xl xl:mx-auto">
            <div className="nw-surface-card mb-10 rounded-2xl border border-white/[0.08] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {blog.authorAvatar ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2 ring-violet-500/20">
                      <SafeImage src={blog.authorAvatar} alt={blog.author} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white">
                      {blog.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{blog.author}</p>
                    {authorProfile && <p className="text-sm text-violet-400">{authorProfile.title}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CardActions id={blog._id} title={blog.title} />
                  <button type="button" onClick={() => share()} className="nw-btn-ghost inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-300">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
              {authorProfile?.bio && (
                <p className="mt-4 border-t border-white/[0.06] pt-4 text-sm leading-relaxed text-slate-500">{authorProfile.bio}</p>
              )}
            </div>

            <div className="mb-8 flex gap-2 xl:hidden">
              <button type="button" onClick={() => share('copy')} className="nw-btn-ghost rounded-lg px-3 py-1.5 text-xs text-slate-400"><Link2 className="mr-1 inline h-3.5 w-3.5" />Copy</button>
              <button type="button" onClick={() => share()} className="nw-btn-ghost rounded-lg px-3 py-1.5 text-xs text-slate-400"><Share2 className="mr-1 inline h-3.5 w-3.5" />Share</button>
            </div>

            {headings.length > 0 && (
              <div className="mb-8 xl:hidden"><TableOfContents headings={headings} /></div>
            )}

            <ArticleReactions articleId={blog._id} />

            <div className="nw-article-prose mt-10 max-w-none">
              {blog.content.split('\n\n').map((p, i) => {
                if (p.startsWith('## ')) {
                  const text = p.replace('## ', '');
                  const hid = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h2 key={i} id={hid}>{text}</h2>;
                }
                return <p key={i}>{p}</p>;
              })}
            </div>

            {nextArticle && (
              <Link
                href={`/blogs/${nextArticle._id}`}
                className="nw-surface-card group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] p-6 transition-colors hover:border-violet-500/30"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Next story</p>
                  <p className="font-display mt-1 text-lg font-bold text-white group-hover:text-violet-300">{nextArticle.title}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-400" />
              </Link>
            )}
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-[calc(var(--site-header-offset)+24px)]">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-white/[0.06] bg-[var(--nw-surface)] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-white">Related intelligence</h2>
            <p className="mt-1 text-sm text-slate-500">Continue reading in {blog.category}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => <BlogCard key={b._id} blog={b} />)}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </article>
  );
}
