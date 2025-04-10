'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display } from 'next/font/google';

// Instancier la police Playfair Display (ou importer depuis un fichier partagé)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], // Assurer les poids nécessaires
  display: 'swap',
});

interface AnimatedPageTitleProps {
  title: string;
  className?: string; // Permettre de passer des classes supplémentaires
}

const AnimatedPageTitle: React.FC<AnimatedPageTitleProps> = ({ title, className }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-4xl md:text-5xl mb-6 text-gray-900 dark:text-white ${playfairDisplay.className} ${className || ''}`}
    >
      {title}
    </motion.h1>
  );
};

export default AnimatedPageTitle;