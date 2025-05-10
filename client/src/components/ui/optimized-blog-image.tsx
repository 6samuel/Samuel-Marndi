import React from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';

interface OptimizedBlogImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedBlogImage({ src, alt, className }: OptimizedBlogImageProps) {
  // Fallback image for error handling
  const fallbackImage = "https://placehold.co/640x360?text=Blog+Image+Not+Found";
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = fallbackImage;
  };
  
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      className={cn('w-full h-full object-cover', className)}
      width={640}
      height={360}
      onError={handleImageError}
      loading="lazy"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 640px"
    />
  );
}