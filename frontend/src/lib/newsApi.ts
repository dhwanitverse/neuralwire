import api from './api';
import { Blog, ApiResponse } from '@/types';

export async function getAllNews(params?: {
  field?: string;
  search?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.field) searchParams.set('field', params.field);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const res = await api.get<ApiResponse<Blog[]> & { field: string }>(
    `/news?${searchParams.toString()}`
  );
  return res.data;
}

export async function getNewsByField(field: string) {
  const res = await api.get<ApiResponse<Blog[]> & { field: string }>(
    `/news/field/${encodeURIComponent(field)}`
  );
  return res.data;
}

export async function getNewsFields() {
  const res = await api.get<ApiResponse<{ name: string; count: number }[]>>('/news/fields');
  return res.data;
}
