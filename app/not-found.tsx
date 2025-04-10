'use client'; // Nécessaire car not-found s'exécute côté client dans App Router

import Link from 'next/link';
import Image from 'next/image';
import { Home, Search } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { Button } from '@/components/ui/button'; // Utiliser le composant Button
import { motion } from 'framer-motion'; // Importer motion

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'], // Utiliser le poids nécessaire (bold dans ce cas)
  display: 'swap',
});

export default function NotFound() {
  return (
    // Centrer le contenu verticalement et horizontalement
    <main className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-gray-900 px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Image personnalisée 404 */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-8">
          <Image
            src="/images/404-cake.png" // Utiliser l'image copiée précédemment
            alt="Gâteau 404 - Page non trouvée"
            fill
            sizes="224px" // Taille fixe pour l'image
            priority // Important pour LCP sur cette page
            className="object-contain"
          />
        </div>

        {/* Titre avec police spécifique */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          // Retrait du délai
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4 ${playfairDisplay.className}`}
        >
          Oups ! Page non trouvée
        </motion.h1>

        {/* Message d'erreur */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          La page que vous cherchez semble s'être perdue dans la cuisine...
          Mais ne vous inquiétez pas, nous pouvons vous aider à retrouver votre chemin !
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800">
            <Link href="/recettes">
              <Search className="w-5 h-5 mr-2" />
              Voir les recettes
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}