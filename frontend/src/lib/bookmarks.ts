const STORAGE_KEY = 'neuralwire_bookmarks';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}

export function toggleBookmark(id: string): boolean {
  const current = getBookmarks();
  const exists = current.includes(id);
  const next = exists ? current.filter((b) => b !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('bookmarks-changed'));
  return !exists;
}
