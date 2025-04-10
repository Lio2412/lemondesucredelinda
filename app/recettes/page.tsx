// Retirer 'use client' pour en faire un Server Component
import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import RecipeGrid from '@/components/recipe/RecipeGrid';
// Importer le nouveau composant client pour le titre
import AnimatedPageTitle from '@/components/layout/AnimatedPageTitle';
// Retirer l'import de motion

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Suppression des types locaux, des catégories mockées et des recettes mockées

export default async function RecettesPage() { // Rendre async
  // Récupérer toutes les recettes depuis Prisma
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    // Sélectionner uniquement les champs existants dans le modèle Prisma Recipe
    select: {
      id: true,
      title: true,
      image: true,
      slug: true, // Ajouter le slug
      description: true, // Ajouter description
      category: true,    // Ajouter category
      // Les champs difficulty, prepTime, cookTime ne sont pas nécessaires pour la grille
      // On pourrait sélectionner ingredients et steps si RecipeCard en avait besoin,
      // mais ce n'est pas le cas actuellement.
      // ingredients: true,
      // steps: true,
      createdAt: true, // Garder createdAt si nécessaire (ex: tri ou affichage)
    }
  });

  // La logique de filtrage et d'affichage sera dans RecipeGrid
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16"> {/* Ajustement padding top */}

        {/* === Section Titre et Recherche === */}
        <section className="mb-12 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Utiliser le composant client pour le titre */}
            <AnimatedPageTitle title="Nos Recettes" />
            <div className="w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Explorez notre collection de recettes de pâtisserie française, des classiques traditionnels aux créations modernes.
            </p>

            {/* La barre de recherche, les filtres et la grille seront dans RecipeGrid */}
          </div>
        </section>

        {/* === Section Filtres et Grille === */}
        <section>
           {/* Passer les recettes récupérées au composant client */}
           <RecipeGrid recipes={recipes} />
        </section>
      </div>
    </main>
  );
}