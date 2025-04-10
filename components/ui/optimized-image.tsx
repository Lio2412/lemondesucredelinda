'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
}: OptimizedImageProps) {
  // Vérifie si la source est une data URL
  const isDataUrl = typeof src === 'string' && src.startsWith('data:');

  // Si c'est une data URL, on utilise directement l'image sans optimisation
  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('w-full h-full object-cover', className)}
      />
    );
  }

  // Pour les URLs normales, on utilise next/image avec l'optimisation
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('w-full h-full object-cover', className)}
      priority={priority}  
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
