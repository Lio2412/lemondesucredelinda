/**
 * Interface de base pour un ingrédient avec des détails structurés.
 */
interface IngredientDetails {
  name: string;
  quantity?: number;
  unit?: string;
}

/**
 * Représente un ingrédient qui est juste une chaîne de texte (ex: "sel").
 */
type IngredientText = string;

/**
 * Type pour un ingrédient, qui peut être soit une simple chaîne de texte,
 * soit un objet avec des détails structurés.
 */
export type Ingredient = IngredientText | IngredientDetails;

/**
 * Interface définissant la structure d'un objet Recette.
 */
export interface Recipe {
  id?: string | number; // Ajout d'un identifiant optionnel
  title?: string; // Ajout d'un titre optionnel
  description?: string; // Ajout d'une description optionnelle
  servings?: number;
  preparationTime?: number; // En minutes
  cookingTime?: number; // En minutes
  ingredients: Ingredient[];
  equipment?: string[];
  instructions?: string[]; // Ajout des instructions optionnelles
  // Ajoutez d'autres champs pertinents si nécessaire (ex: catégorie, difficulté, notes)
  difficulty?: 'facile' | 'moyen' | 'difficile'; // Ajout de la difficulté optionnelle
}
