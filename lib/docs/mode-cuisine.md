# Documentation du Module "Mode Cuisine"

## 1. But du Module

Le module "Mode Cuisine" fournit une interface interactive pour guider l'utilisateur à travers les étapes d'une recette de cuisine. Il permet d'ajuster le nombre de portions, de suivre les ingrédients utilisés et de visualiser la progression étape par étape.

## 2. Structure des Données Attendues

Le composant principal `ModeCuisine` attend des données structurées comme suit :

```typescript
// Types principaux (définis dans components/mode-cuisine/ModeCuisine.tsx)

type Ingredient = {
  name: string;      // Nom de l'ingrédient (doit être unique)
  quantity: number;  // Quantité pour le nombre de portions de base
  unit: string;      // Unité de mesure (ex: "g", "ml", "unité")
};

type Step = {
  title?: string;     // Titre optionnel de l'étape (sinon "Étape X")
  content: string;   // Instructions pour l'étape
  duration?: number;  // Durée estimée en minutes (optionnel, pour futur minuteur)
  ingredientsUsed?: string[]; // Noms des ingrédients principaux utilisés (optionnel)
};

// Props attendues par le composant ModeCuisine
type ModeCuisineProps = {
  title: string;           // Titre de la recette
  basePortions: number;    // Nombre de portions pour lequel la recette est écrite initialement
  ingredients: Ingredient[]; // Liste complète des ingrédients
  steps: Step[];           // Liste des étapes de la recette
};
```

## 3. Composants Internes

Le module est divisé en plusieurs sous-composants pour une meilleure modularité :

-   **`ModeCuisine.tsx`**: Composant principal orchestrant l'état et l'affichage.
-   **`IngredientsList.tsx`**: Affiche la liste des ingrédients ajustés aux portions, avec cases à cocher.
-   **`StepDisplay.tsx`**: Affiche le contenu de l'étape actuelle, son numéro et le total.
-   **`PortionSelector.tsx`**: Permet à l'utilisateur d'augmenter ou diminuer le nombre de portions.
-   **`ProgressBar.tsx`**: Indique visuellement la progression dans les étapes.
-   **`FinishRecipe.tsx`**: Écran affiché lorsque toutes les étapes sont terminées.

## 4. Comportements Spéciaux

-   **Ajustement des Portions**: Le `PortionSelector` modifie l'état `portions` dans `ModeCuisine`. Les quantités dans `IngredientsList` sont recalculées dynamiquement.
-   **Suivi des Ingrédients**: Cocher un ingrédient dans `IngredientsList` met à jour l'état `checkedIngredients` et applique un style barré.
-   **Navigation entre Étapes**: Les boutons "Précédent" et "Suivant" mettent à jour l'état `currentStepIndex`.
-   **Progression**: La `ProgressBar` reflète l'état `currentStepIndex`.
-   **Fin de Recette**: Lorsque la dernière étape est passée, le composant `FinishRecipe` est affiché.
-   **Minuteur (Placeholder)**: Si une étape a une `duration`, une indication est affichée, mais la fonctionnalité de minuteur actif n'est pas implémentée dans cette version.

## 5. Style et Dépendances

-   **Style**: Utilise Tailwind CSS pour la mise en page et le style, en s'appuyant sur les conventions du projet.
-   **Composants UI**: Utilise des composants de `shadcn/ui` (`Button`, `Checkbox`, `Label`, `Progress`) pour une cohérence visuelle.
-   **Icônes**: Utilise `lucide-react` pour les icônes.

Ce système de composants est conçu pour être facilement intégrable dans une application React/Next.js utilisant Tailwind CSS et shadcn/ui.