import React from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroImage({ src, alt, className }: HeroImageProps) {
  return (
    <div className={cn('hero-image-container', className)}>
      <OptimizedImage 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        width={1200}
        height={675}
        priority={true} // Load with high priority as it's a hero image
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 1200px"
      />
    </div>
  );
}