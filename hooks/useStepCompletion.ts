import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

interface UseStepCompletionProps {
  recipeId: string | undefined;
  totalSteps: number;
}

interface UseStepCompletionReturn {
  completedSteps: Set<number>;
  toggleStep: (index: number) => void;
  isStepCompleted: (index: number) => boolean;
  resetCompletion: () => void;
  progress: number;
}

/**
 * Hook personnalisé pour gérer l'état des étapes complétées d'une recette.
 * Utilise le localStorage pour persister l'état entre les sessions.
 * @param recipeId - L'identifiant unique de la recette.
 * @param totalSteps - Le nombre total d'étapes dans la recette.
 */
export function useStepCompletion({
  recipeId = 'unknown-recipe',
  totalSteps,
}: UseStepCompletionProps): UseStepCompletionReturn {
  const storageKey = `recipeCompletion_${recipeId}`;
  // Utilise useLocalStorage pour stocker les indices des étapes complétées (sérialisés en tableau)
  const [completedIndices, setCompletedIndices] = useLocalStorage<number[]>(storageKey, []);

  // Convertit le tableau d'indices en Set pour des vérifications plus rapides
  const completedSteps = useMemo(() => new Set(completedIndices), [completedIndices]);

  const toggleStep = useCallback((index: number) => {
    if (index < 0 || index >= totalSteps) {
      console.warn(`Tentative de basculer une étape invalide : ${index}`);
      return;
    }
    setCompletedIndices(prevIndices => {
      const newSet = new Set(prevIndices);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return Array.from(newSet); // Retourne un tableau pour le localStorage
    });
  }, [setCompletedIndices, totalSteps]);

  const isStepCompleted = useCallback((index: number): boolean => {
    return completedSteps.has(index);
  }, [completedSteps]);

  // Fonction pour réinitialiser l'état de complétion
  const resetCompletion = useCallback(() => {
    setCompletedIndices([]);
  }, [setCompletedIndices]);

  // Calcule le pourcentage de progression
  const progress = useMemo(() => {
    if (totalSteps === 0) return 0;
    return Math.round((completedSteps.size / totalSteps) * 100);
  }, [completedSteps.size, totalSteps]);

  return {
    completedSteps,
    toggleStep,
    isStepCompleted,
    resetCompletion,
    progress,
  };
}
