export const revalidate = 0; // Désactiver la mise en cache des données
import React from 'react';
import { Playfair_Display } from 'next/font/google';
// Importer la fonction spécifique pour la grille publique
import { getRecipesForGrid } from '@/lib/data/recipes';
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
  // Récupérer les recettes publiées avec les champs spécifiques pour la grille
  const recipes = await getRecipesForGrid();

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