'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Input } from '@/components/ui/input';
// Importer RecipeCategory comme valeur et Recipe comme type
import { RecipeCategory, type Recipe } from '@prisma/client';

// Type ajusté pour inclure description et category, slug supprimé
type RecipeForGrid = Pick<
  Recipe,
  | 'id'
  | 'title'
  // | 'slug' // Supprimé
  | 'image'
  | 'description'
  | 'category'
>;

interface RecipeGridProps {
  recipes: RecipeForGrid[];
}

// Les catégories seront générées dynamiquement

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tous'); // Initialiser avec "Tous" (majuscule)
  const [searchQuery, setSearchQuery] = useState('');

  // Générer dynamiquement les catégories uniques à partir des recettes
  const categories = useMemo(() => {
    // Utiliser les valeurs de l'enum RecipeCategory
    const validCategories = recipes
      .map(recipe => recipe.category)
      // Filtrer les valeurs null/undefined et s'assurer qu'elles sont des RecipeCategory valides
      .filter((cat): cat is RecipeCategory => cat !== null && cat !== undefined && Object.values(RecipeCategory).includes(cat));
    const uniqueCategories = new Set(validCategories);
    const categoryList = Array.from(uniqueCategories).sort(); // Trier alphabétiquement les valeurs de l'enum
    return ['Tous', ...categoryList]; // Ajouter "Tous" au début
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Filtrer par catégorie sélectionnée
      const categoryMatch = selectedCategory === 'Tous' || recipe.category === selectedCategory;

      // Filtrer par terme de recherche (titre ou description)
      const searchMatch = searchQuery === '' ||
        (recipe.title && recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())); // Ajout recherche dans description

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery, recipes]);

  return (
    <>
      {/* Barre de recherche */}
      <div className="relative flex items-center mb-8 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Rechercher une recette..."
          /* Suppression focus:border-* et focus:outline-none */
          className="pl-10 pr-4 py-2 w-full border rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((categoryName) => (
          <button
            key={categoryName}
            onClick={() => setSelectedCategory(categoryName)}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
              selectedCategory === categoryName
                ? 'bg-pink-600 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {categoryName}
          </button>
        ))}
      </div>

      {/* Grille des recettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id} // Ajouter la prop id
              title={recipe.title}
              // slug={recipe.slug} // Supprimé
              image={recipe.image ?? '/images/default-recipe.jpg'}
              description={recipe.description ?? undefined} // Passer undefined si null
              category={recipe.category ?? undefined} // Passer la valeur de l'enum
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucune recette ne correspond à vos critères.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous'); // Réinitialiser à "Tous"
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-800/40 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </>
  );
}