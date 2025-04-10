'use client';

import React, { useState } from 'react';
import { CookingMode } from '@/components/recipe/CookingMode'; // Importer le composant modal existant

// Définir les types pour les props attendues (basés sur les données Prisma/page)
interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Step {
  id: string;
  description: string;
  duration?: number;
  // ingredientsUsed?: string[]; // Non utilisé pour l'instant
}

interface CookingModeWrapperProps {
  recipeTitle: string;
  steps: Step[];
  ingredients: Ingredient[];
  basePortions: number;
  children: React.ReactNode; // Pour le bouton déclencheur
}

export function CookingModeWrapper({
  recipeTitle,
  steps,
  ingredients,
  basePortions,
  children,
}: CookingModeWrapperProps) {
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);

  const handleOpen = () => setIsCookingModeOpen(true);
  const handleClose = () => setIsCookingModeOpen(false);

  return (
    <>
      {/* Rendre le bouton (ou autre élément) qui déclenche l'ouverture */}
      {/* Ajouter l'événement onClick pour ouvrir le mode cuisine */}
      {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, { onClick: handleOpen }) : children}

      {/* Afficher conditionnellement le Mode Cuisine */}
      {isCookingModeOpen && (
        <CookingMode
          recipeTitle={recipeTitle}
          steps={steps}
          ingredients={ingredients} // Passer les ingrédients structurés
          basePortions={basePortions}
          onClose={handleClose}
        />
      )}
    </>
  );
}