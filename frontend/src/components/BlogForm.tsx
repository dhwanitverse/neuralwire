'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Type, AlignLeft, FileText, Tag, User, ImageIcon, Loader2, CheckCircle2, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Blog, BlogFormData } from '@/types';
import { CATEGORIES } from '@/lib/utils';
import { getImageUrlValidationError, probeImageLoad, isAllowedImageHost } from '@/lib/images';
import { useAuth } from '@/context/AuthContext';
import InputField from './ui/InputField';
import Button from './ui/Button';

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (data: BlogFormData) => Promise<void>;
  submitLabel: string;
}

type ImageStatus = 'idle' | 'checking' | 'valid' | 'invalid';

export default function BlogForm({ initialData, onSubmit, submitLabel }: BlogFormProps) {
  const { user } = useAuth();
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    image: initialData?.image || '',
    author: initialData?.author || user?.name || '',
    authorAvatar: initialData?.authorAvatar || user?.profilePicture || '',
    featured: initialData?.featured || false,
    editorsPick: initialData?.editorsPick || false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState<ImageStatus>(
    initialData?.image ? 'valid' : 'idle'
  );
  const probeId = useRef(0);

  useEffect(() => {
    if (!isEditing && user?.name) {
      setForm((p) => ({
        ...p,
        author: p.author || user.name,
        authorAvatar: p.authorAvatar || user.profilePicture || '',
      }));
    }
  }, [user, isEditing]);

  const validateImage = useCallback(async (url: string, clearErrorOnValid = true) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setImageStatus('idle');
      return;
    }

    const formatError = getImageUrlValidationError(trimmed);
    if (formatError) {
      setImageStatus('invalid');
      setErrors((p) => ({ ...p, image: formatError }));
      return;
    }

    const id = ++probeId.current;
    setImageStatus('checking');
    const ok = await probeImageLoad(trimmed);
    if (id !== probeId.current) return;

    if (ok) {
      setImageStatus('valid');
      if (clearErrorOnValid) {
        setErrors((p) => ({ ...p, image: undefined }));
      }
    } else {
      setImageStatus('invalid');
      setErrors((p) => ({
        ...p,
        image: 'Image could not be loaded. Check the URL is a direct link to an image file.',
      }));
    }
  }, []);

  useEffect(() => {
    if (!form.image.trim()) {
      setImageStatus('idle');
      return;
    }
    if (isEditing && form.image === initialData?.image && imageStatus === 'valid') {
      return;
    }
    const t = setTimeout(() => validateImage(form.image), 450);
    return () => clearTimeout(t);
  }, [form.image, validateImage, isEditing, initialData?.image, imageStatus]);

  const validate = () => {
    const e: Partial<Record<keyof BlogFormData, string>> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.author.trim()) e.author = 'Author name is required';

    const imageError = getImageUrlValidationError(form.image);
    if (imageError) {
      e.image = imageError;
    } else if (imageStatus !== 'valid') {
      e.image =
        imageStatus === 'checking'
          ? 'Please wait while the image is verified'
          : 'Image could not be loaded. Check the URL is a direct link to an image file.';
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.image.trim() && imageStatus !== 'valid') {
      await validateImage(form.image, false);
    }

    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        authorAvatar: form.authorAvatar?.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof BlogFormData, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (field === 'image') {
      setImageStatus('idle');
    }
    if (errors[field] && field !== 'image') {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const showPreview = form.image.trim() && imageStatus === 'valid';
  const useNextImage = showPreview && isAllowedImageHost(form.image);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Title"
        icon={Type}
        placeholder="An engaging headline"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
      />
      <InputField
        label="Description"
        icon={AlignLeft}
        placeholder="Brief summary for the card"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        error={errors.description}
      />
      <InputField
        as="textarea"
        label="Content"
        icon={FileText}
        placeholder="Write your article. Use ## for section headings."
        value={form.content}
        onChange={(e) => set('content', e.target.value)}
        error={errors.content}
        rows={14}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          as="select"
          label="Category"
          icon={Tag}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <InputField
          label="Author"
          icon={User}
          placeholder="Your name"
          value={form.author}
          onChange={(e) => set('author', e.target.value)}
          error={errors.author}
        />
      </div>

      <div className="space-y-2">
        <InputField
          label="Cover Image URL"
          icon={ImageIcon}
          placeholder="https://images.unsplash.com/photo-..."
          value={form.image}
          onChange={(e) => set('image', e.target.value)}
          error={errors.image}
          hint="Direct .jpg/.png/.webp URL, or Unsplash/Pexels image links"
        />
        {form.image.trim() && imageStatus === 'checking' && (
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying image...
          </p>
        )}
        {showPreview && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Image verified
            </p>
            <div className="relative aspect-[16/7] overflow-hidden rounded-2xl ring-1 ring-emerald-500/20">
              {useNextImage ? (
                <Image src={form.image.trim()} alt="Cover preview" fill className="object-cover" unoptimized />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image.trim()} alt="Cover preview" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        )}
      </div>

      <InputField
        label="Author Avatar URL (optional)"
        icon={ImageIcon}
        placeholder="https://..."
        value={form.authorAvatar || ''}
        onChange={(e) => set('authorAvatar', e.target.value)}
        hint="Defaults to your profile picture when creating a new article"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/30"
          />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <Star className="h-3.5 w-3.5 text-amber-400" /> Featured article
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Shown in homepage hero sections</p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
          <input
            type="checkbox"
            checked={form.editorsPick}
            onChange={(e) => set('editorsPick', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/30"
          />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Editor&apos;s pick
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Curated in Editor&apos;s Picks section</p>
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-6">
        <Button type="submit" loading={loading} size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
