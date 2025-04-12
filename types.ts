// types.ts

export interface Ingredient {
  name: string;
  quantity: string; // Peut être affiné plus tard (ex: { value: number; unit: string })
}

// Mettre à jour pour correspondre au modèle Prisma Recipe
export interface Recipe {
  id: string;
  title: string;
  // slug: string; // N'existe pas dans le modèle Prisma actuel
  // description: string; // N'existe pas dans le modèle Prisma actuel
  // prepTime: number; // N'existe pas dans le modèle Prisma actuel
  // cookTime: number; // N'existe pas dans le modèle Prisma actuel
  // servings: number; // N'existe pas dans le modèle Prisma actuel
  image: string | null; // Correspond à 'image: String?' dans Prisma
  // ingredients: Ingredient[]; // Le modèle Prisma a 'ingredients: String[]'
  ingredients: string[]; // Correspond au modèle Prisma
  steps: string[]; // Correspond au modèle Prisma
  createdAt: Date;
  updatedAt: Date;
  // category?: string; // N'existe pas dans le modèle Prisma actuel
}

// Mettre à jour pour correspondre au modèle Prisma Creation
export interface Creation {
  id: string;
  title: string;
  description: string; // Est non-optionnel dans Prisma
  image: string | null; // Correspond à 'image: String?' dans Prisma
  published: boolean; // Ajouté pour correspondre au modèle Prisma
  createdAt: Date;
  updatedAt: Date;
  // category?: string; // N'existe pas dans le modèle Prisma actuel
}

// Mettre à jour pour correspondre au modèle Prisma Article
export interface Article {
  id: string;
  title: string;
  // slug: string; // N'existe pas dans le modèle Prisma actuel
  content: string; // Correspond au modèle Prisma
  // imageUrl?: string; // N'existe pas dans le modèle Prisma actuel
  tags: string[]; // Correspond au modèle Prisma
  createdAt: Date;
  updatedAt: Date;
  // author?: string; // N'existe pas dans le modèle Prisma actuel
  // category?: string; // N'existe pas dans le modèle Prisma actuel
}

// Type générique pour les contenus affichés dans le dashboard
// Type simplifié pour les contenus affichés dans le tableau du dashboard admin
export type ContentItem = {
  id: string;
  title: string;
  createdAt: Date;
  type: 'recipe' | 'creation' | 'article';
};