'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Rating({
  initialRating = 0,
  onChange,
  readOnly = false,
  size = 'md',
  className
}: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Définition de la fonction handleClick
  const handleClick = (value: number) => {
    if (readOnly) return; // Ne rien faire si readOnly
    setRating(value);
    onChange?.(value);
  };

  // Définir les classes de taille pour l'icône Star
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div 
      className={cn("flex gap-1 items-center", className)}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          type="button"
          whileHover={{ scale: readOnly ? 1 : 1.1 }}
          whileTap={{ scale: readOnly ? 1 : 0.9 }}
          className={cn(
            "transition-colors",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readOnly && setHoverRating(value)}
        >
          <Star
            className={cn(
              'transition-colors',
              sizeClasses[size], // Utiliser la classe de taille correcte
              (hoverRating >= value || rating >= value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
} 