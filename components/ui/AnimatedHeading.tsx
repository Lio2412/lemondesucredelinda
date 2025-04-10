'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

// Props pour le composant AnimatedHeading
interface AnimatedHeadingProps extends HTMLMotionProps<"h1"> { // Étend les props de motion.h1
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Permet de choisir la balise
  children: React.ReactNode;
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  as: Tag = 'h1', // h1 par défaut
  children,
  className,
  ...rest // Récupère les autres props motion (initial, animate, etc.)
}) => {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Retrait du délai par défaut
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className} // Applique les classes passées en props
      {...rest} // Applique les autres props motion
    >
      {children}
    </MotionTag>
  );
};

export default AnimatedHeading;