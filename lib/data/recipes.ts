import { prisma } from '@/lib/prisma';
import { Recipe } from '@prisma/client'; // Importer le type Recipe généré par Prisma

// Fonction pour récupérer toutes les recettes depuis Prisma
// Type pour le retour de getAllRecipes incluant le compte des étapes
export type RecipeWithStepCount = Pick<Recipe, 'id' | 'title' | 'createdAt'> & {
  _count: {
    steps: number;
  };
};

export const getAllRecipes = async (): Promise<RecipeWithStepCount[]> => {
  try {
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { // Inclure le comptage des relations
          select: { steps: true }, // Compter les étapes associées
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Le type retourné correspond maintenant à RecipeWithStepCount[]
    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    throw new Error("Impossible de récupérer les recettes.");
  }
};

// Fonction pour récupérer une recette par son ID depuis Prisma, incluant ingrédients et étapes
export const getRecipeById = async (id: string) => { // Le type retourné est inféré par Prisma avec les includes
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: { orderBy: { id: 'asc' } }, // Ordonner si nécessaire
        steps: { orderBy: { order: 'asc' } },   // Ordonner par le champ 'order'
      },
    });
    return recipe; // Retourne Recipe & { ingredients: Ingredient[], steps: RecipeStep[] } | null
  } catch (error) {
    console.error(`Erreur lors de la récupération de la recette ${id}:`, error);
    return null; // Retourner null pour gérer notFound dans la page
  }
};

// Fonction pour récupérer une recette par son SLUG depuis Prisma, incluant ingrédients et étapes
export const getRecipeBySlug = async (slug: string) => { // Le type retourné est inféré
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        ingredients: { orderBy: { id: 'asc' } },
        steps: { orderBy: { order: 'asc' } },
      },
    });
    return recipe;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la recette par slug ${slug}:`, error);
    return null;
  }
};

// Les données mockées sont supprimées.