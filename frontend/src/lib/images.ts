/** Default tech blog cover — Unsplash */
export const DEFAULT_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop';

/** Hostnames allowed for next/image optimization */
export const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'images.pexels.com',
  'plus.unsplash.com',
  'cdn.pixabay.com',
  'picsum.photos',
];

const IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i;

const WEBPAGE_PATH_PATTERN =
  /\/(blog|article|posts?|pages?|gallery|photos-vectors|free-photos|collections?|topics?)(\/|$)/i;

function parseUrl(url: string): URL | null {
  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function hasImageExtension(pathname: string, search: string): boolean {
  return IMAGE_EXT_PATTERN.test(`${pathname}${search}`);
}

function isKnownCdnPhotoUrl(hostname: string, pathname: string): boolean {
  if (!ALLOWED_IMAGE_HOSTS.includes(hostname)) return false;
  if (hostname === 'images.unsplash.com' || hostname === 'plus.unsplash.com') {
    return /\/photo(-[a-z0-9-]+)?\//i.test(pathname) || pathname.startsWith('/photo-');
  }
  if (hostname === 'images.pexels.com') {
    return /\/photos?\//i.test(pathname);
  }
  if (hostname === 'cdn.pixabay.com') {
    return pathname.length > 1;
  }
  if (hostname === 'picsum.photos') {
    return pathname.length > 1;
  }
  return false;
}

/**
 * Returns a user-facing validation error, or null if the URL format is acceptable.
 * Final load success is confirmed separately via image onLoad in the form.
 */
export function getImageUrlValidationError(url: string | undefined | null): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return 'Cover image URL is required';

  const parsed = parseUrl(trimmed);
  if (!parsed) return 'Enter a valid URL starting with https://';

  const { pathname, hostname, search } = parsed;

  if (hasImageExtension(pathname, search)) return null;
  if (isKnownCdnPhotoUrl(hostname, pathname)) return null;

  if (WEBPAGE_PATH_PATTERN.test(pathname)) {
    return 'Please use a direct image URL, not a webpage URL.';
  }

  if (!ALLOWED_IMAGE_HOSTS.includes(hostname)) {
    return 'Please use a direct image URL, not a webpage URL.';
  }

  return 'Use a direct image link (e.g. images.unsplash.com/photo-... or a .jpg/.png URL).';
}

export function isAllowedImageHost(url: string): boolean {
  const parsed = parseUrl(url);
  return parsed ? ALLOWED_IMAGE_HOSTS.includes(parsed.hostname) : false;
}

export function isDirectImageUrl(url: string): boolean {
  return getImageUrlValidationError(url) === null;
}

export function getSafeImageUrl(url: string | undefined | null): string {
  if (!url?.trim()) return DEFAULT_BLOG_IMAGE;
  if (!isDirectImageUrl(url)) return DEFAULT_BLOG_IMAGE;
  return url.trim();
}

/** Probe whether the image actually loads in the browser. */
export function probeImageLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const formatError = getImageUrlValidationError(url);
    if (formatError) {
      resolve(false);
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url.trim();
  });
}
