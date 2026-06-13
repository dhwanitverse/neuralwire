import api from '@/lib/api';

type CacheEntry<T> = { data: T; ts: number };

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

const DEFAULT_TTL_MS = 90_000;

export async function cachedGet<T>(
  url: string,
  options?: { ttlMs?: number; dataKey?: 'data' | 'root' }
): Promise<T> {
  const ttl = options?.ttlMs ?? DEFAULT_TTL_MS;
  const hit = store.get(url);
  if (hit && Date.now() - hit.ts < ttl) {
    return hit.data as T;
  }

  const pending = inflight.get(url);
  if (pending) return pending as Promise<T>;

  const request = api
    .get(url)
    .then((res) => {
      const data = options?.dataKey === 'root' ? res.data : res.data.data;
      store.set(url, { data, ts: Date.now() });
      inflight.delete(url);
      return data as T;
    })
    .catch((err) => {
      inflight.delete(url);
      throw err;
    });

  inflight.set(url, request);
  return request as Promise<T>;
}

export function invalidateCache(urlPrefix?: string) {
  if (!urlPrefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(urlPrefix)) store.delete(key);
  }
}
