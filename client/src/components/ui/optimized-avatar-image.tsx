import React from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';

interface OptimizedAvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedAvatarImage({ src, alt, className }: OptimizedAvatarImageProps) {
  // Fallback image for error handling
  const fallbackImage = "https://placehold.co/100x100?text=User";
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = fallbackImage;
  };
  
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      className={cn('w-full h-full object-cover rounded-full', className)}
      width={100}
      height={100}
      onError={handleImageError}
      loading="lazy"
      sizes="(max-width: 640px) 32px, 48px"
    />
  );
}