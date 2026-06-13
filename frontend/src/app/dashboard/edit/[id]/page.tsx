'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { invalidateCache } from '@/lib/fetchCache';
import { Blog, BlogFormData } from '@/types';
import { getApiErrorMessage } from '@/lib/errors';
import BlogForm from '@/components/BlogForm';
import { useAuth } from '@/context/AuthContext';

function EditContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    api
      .get(`/blogs/${id}`)
      .then((r) => {
        const data = r.data.data as Blog;
        const ownerId = typeof data.userId === 'object' ? (data.userId as { _id?: string })._id : data.userId;
        if (ownerId !== user._id && user.role !== 'admin') {
          setForbidden(true);
          toast.error('You are not authorized to edit this article');
          router.replace('/dashboard');
          return;
        }
        setBlog(data);
      })
      .catch(() => {
        toast.error('Article not found');
        router.replace('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, user, router]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      await api.put(`/blogs/${id}`, data);
      invalidateCache('/blogs');
      toast.success('Article updated!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update article'));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this article permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/blogs/${id}`);
      invalidateCache('/blogs');
      toast.success('Article deleted');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete article'));
    }
  };

  if (loading || forbidden) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-[28rem] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="dash-page">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-violet-400">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-400 transition-colors hover:text-red-300">
            Delete article
          </button>
        </div>
        <div className="dash-panel p-6 sm:p-8">
          <BlogForm initialData={blog} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </div>
      </div>
    </div>
  );
}

export default function EditBlogPage() {
  return <EditContent />;
}
