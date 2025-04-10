// Retirer 'use client' pour en faire un Server Component
import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { prisma } from '@/lib/prisma';
// Importer le composant client pour le titre
import AnimatedPageTitle from '@/components/layout/AnimatedPageTitle';
// Importer le composant client pour la grille
import BlogGrid from '@/components/blog/BlogGrid';
// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Suppression de l'interface locale, des données mockées et des catégories mockées

export default async function BlogPage() { // Rendre async
  // Récupérer les articles depuis Prisma
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    // Sélectionner les champs nécessaires pour l'affichage et le filtrage/lien
    select: {
      id: true,
      title: true,
      createdAt: true,
      tags: true, // Pourrait être utilisé pour les catégories/tags
      content: true, // Pour le résumé et la recherche
      slug: true,    // Ajouter le slug pour les liens
      image: true,   // Ajouter l'image pour l'affichage
    }
  });

  // La logique de recherche, filtrage, pagination et affichage sera dans BlogGrid

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-24 md:pt-32"> {/* Harmonisation du padding-top avec /recettes */}
      {/* Section Titre harmonisée */}
      <section className="mb-12 text-center"> {/* Utilisation de section et mb-12 comme /recettes */}
        <div className="container mx-auto px-4"> {/* Container ajouté ici pour englober le max-w */}
          <div className="max-w-3xl mx-auto"> {/* Conteneur max-width comme sur /recettes */}
            {/* Titre de la page */}
            {/* Utiliser le composant client pour le titre */}
            <AnimatedPageTitle title="Blog" />
            {/* Séparateur ajouté */}
            <div className="w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"></div>
            {/* Paragraphe de description (style harmonisé) */}
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Découvrez l'art de la pâtisserie française à travers des articles, conseils et actualités.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4">
        {/* Afficher la grille avec les données récupérées */}
        <BlogGrid articles={articles} />
      </div>
    </div>
  );
}