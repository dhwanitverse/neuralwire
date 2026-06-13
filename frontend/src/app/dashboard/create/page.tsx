'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { invalidateCache } from '@/lib/fetchCache';
import { BlogFormData } from '@/types';
import { getApiErrorMessage } from '@/lib/errors';
import BlogForm from '@/components/BlogForm';

function CreateContent() {
  const router = useRouter();

  const handleSubmit = async (data: BlogFormData) => {
    try {
      await api.post('/blogs', data);
      invalidateCache('/blogs');
      toast.success('Article published!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to publish article'));
      throw err;
    }
  };

  return (
    <div className="dash-page">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-violet-400">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="dash-panel p-6 sm:p-8">
          <BlogForm onSubmit={handleSubmit} submitLabel="Publish Article" />
        </div>
      </div>
    </div>
  );
}

export default function CreateBlogPage() {
  return <CreateContent />;
}
