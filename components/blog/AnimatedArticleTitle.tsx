'use client'; // Marquer comme Client Component

import React from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display } from 'next/font/google';

// Recréer l'instance de la police ici car elle est utilisée dans ce composant
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], // Assurez-vous que les poids nécessaires sont inclus
  display: 'swap',
});

interface AnimatedArticleTitleProps {
  title: string;
}

export default function AnimatedArticleTitle({ title }: AnimatedArticleTitleProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-gray-900 dark:text-white ${playfairDisplay.className}`}
    >
      {title}
    </motion.h1>
  );
}