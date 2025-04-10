import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assurez-vous que ce chemin est correct

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToStep: (stepIndex: number) => void; // Pour la navigation rapide (optionnel)
  isStepCompleted: (stepIndex: number) => boolean; // Pour l'indicateur visuel
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onGoToStep, // Non utilisé dans cet exemple simple
  isStepCompleted, // Non utilisé dans cet exemple simple
}) => {
  const canGoPrevious = currentStep > 0;
  const canGoNext = currentStep < totalSteps - 1;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Bouton Précédent */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Étape précédente"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Précédent
      </Button>

      {/* Indicateur d'étape (simple) */}
      <div className="text-sm font-medium text-muted-foreground">
        Étape {currentStep + 1} / {totalSteps}
      </div>

      {/* Bouton Suivant */}
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Étape suivante"
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>

      {/* TODO: Ajouter potentiellement une navigation par points ou dropdown pour onGoToStep */}
    </div>
  );
};
