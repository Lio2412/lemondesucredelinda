'use client';

import React from 'react';
import { Loader2 } from 'lucide-react'; // Import Loader2
import { cn } from '@/lib/utils';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  text?: string;
}

export function Loading({
  className,
  fullScreen = false,
  size = 'md',
  withText = true,
  text = 'Chargement...',
  ...props
}: LoadingProps) {
  // Définir les tailles pour l'icône Loader2
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // Construire le spinner avec Loader2
  const spinner = <Loader2 className={cn('animate-spin', sizeClasses[size])} />;

  // Si on veut le spinner plein écran
  if (fullScreen) {
    return (
      // Apply className and ...props to the outer div
      <div className={cn('flex items-center justify-center min-h-screen', className)} {...props}>
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {withText && <p className="text-lg text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }

  // Retourner seulement le spinner ou avec le texte
  return withText ? (
    // Apply className and ...props to the outer div
    <div className={cn('flex flex-col items-center gap-2', className)} {...props}>
      {spinner}
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  ) : (
    // Apply className and ...props if returning only the spinner (might need a wrapper)
    // For simplicity, let's wrap the spinner in a div if className or props are provided
    className || Object.keys(props).length > 0 ? (
      <div className={className} {...props}>
        {spinner}
      </div>
    ) : (
      spinner
    )
  );
}
