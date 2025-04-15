import { prisma } from '@/lib/prisma';
import { Recipe } from '@prisma/client'; // Importer le type Recipe généré par Prisma

// Fonction pour récupérer toutes les recettes depuis Prisma
// Type pour le retour de getAllRecipes incluant le compte des étapes
export type RecipeWithStepCount = Pick<Recipe, 'id' | 'title' | 'createdAt'> & {
  _count: {
    steps: number;
  };
};

export const getAllRecipes = async ({ includeUnpublished = false }: { includeUnpublished?: boolean } = {}): Promise<RecipeWithStepCount[]> => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: includeUnpublished ? undefined : { published: true }, // Filtrer si includeUnpublished est false
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
    return recipes; // Le type retourné correspond toujours à RecipeWithStepCount[]
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


// Fonction pour récupérer les recettes publiées avec les champs nécessaires pour la grille publique
export const getRecipesForGrid = async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        published: true, // Filtrer par recettes publiées
      },
      select: { // Sélectionner les champs nécessaires pour RecipeGrid
        id: true,
        title: true,
        // slug: true, // Supprimé car n'existe plus
        description: true,
        image: true,
        category: true,
        createdAt: true, // Garder createdAt si RecipeGrid l'utilise pour le tri/affichage
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Le type retourné correspondra à ce que RecipeGrid attend (implicitement)
    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes pour la grille:", error);
    throw new Error("Impossible de récupérer les recettes pour la grille.");
  }
};


// Les données mockées sont supprimées.

// Fonction pour récupérer les N dernières recettes publiées pour la page d'accueil
export const getPublishedRecipes = async (limit: number = 3) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        published: true, // Filtrer par recettes publiées
      },
      take: limit, // Limiter le nombre de résultats
      orderBy: {
        createdAt: 'desc', // Trier par date de création décroissante
      },
      select: { // Sélectionner les champs nécessaires pour l'affichage
        id: true,
        title: true,
        // slug: true, // Supprimé car n'existe plus
        description: true,
        image: true, // Utiliser 'image' comme défini dans le schéma
        category: true,
        difficulty: true,
        prepTime: true, // Utiliser prepTime et cookTime
        cookTime: true,
      },
    });
    return recipes;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes publiées:", error);
    throw new Error("Impossible de récupérer les recettes publiées.");
  }
};
