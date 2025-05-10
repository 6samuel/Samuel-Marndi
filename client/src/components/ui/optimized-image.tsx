import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  sizes = '100vw',
  priority = false,
  ...props
}: OptimizedImageProps) {
  // Convert image URLs to WebP format if they are from unsplash or similar services
  let optimizedSrc = src;
  if (src.includes('unsplash.com') && !src.includes('&fm=webp')) {
    optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}fm=webp&q=80`;
  }
  
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={cn('', className)}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      {...props}
    />
  );
}