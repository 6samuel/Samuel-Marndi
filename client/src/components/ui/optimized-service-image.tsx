import React from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';

interface OptimizedServiceImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedServiceImage({ src, alt, className }: OptimizedServiceImageProps) {
  // Fallback image for error handling
  const fallbackImage = "https://placehold.co/400x300?text=Image+Not+Found";
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = fallbackImage;
  };
  
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      className={cn('w-full h-full object-cover', className)}
      width={400}
      height={300}
      onError={handleImageError}
      loading="lazy"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
    />
  );
}