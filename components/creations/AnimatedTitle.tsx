"use client"; // Marquer ce composant comme Client Component

import { motion } from 'framer-motion';
import { Playfair_Display } from 'next/font/google'; // Importer la police

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], // Assurer que les poids nécessaires sont inclus
  display: 'swap',
});

interface AnimatedTitleProps {
  title: string;
}

const AnimatedTitle = ({ title }: AnimatedTitleProps) => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Utiliser la même transition que sur /recettes pour cohérence
      transition={{ duration: 0.6, ease: "easeOut" }}
      // Appliquer les classes exactes de /recettes et la police
      className={`text-4xl md:text-5xl mb-6 text-gray-900 dark:text-white ${playfairDisplay.className}`}
    >
      {title}
    </motion.h1>
  );
};

export default AnimatedTitle;