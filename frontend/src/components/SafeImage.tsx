'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { DEFAULT_BLOG_IMAGE, getSafeImageUrl, isAllowedImageHost } from '@/lib/images';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

/**
 * Renders blog images safely — falls back to a default Unsplash image
 * when the URL is invalid or the hostname is not configured in next.config.
 */
export default function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const safeSrc = getSafeImageUrl(src);
  const [imgSrc, setImgSrc] = useState(safeSrc);

  useEffect(() => {
    setImgSrc(getSafeImageUrl(src));
  }, [src]);

  const useNextImage = isAllowedImageHost(imgSrc);

  if (!useNextImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        className={className as string}
        onError={() => setImgSrc(DEFAULT_BLOG_IMAGE)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(DEFAULT_BLOG_IMAGE)}
    />
  );
}
