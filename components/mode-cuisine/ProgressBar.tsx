import React from 'react';
import { Progress } from '@/components/ui/progress'; // Utilisation de shadcn/ui Progress

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculer le pourcentage de progression
  // S'assurer que currentStep est au moins 1 pour le calcul, même si l'index est 0-based
  const progressPercentage = totalSteps > 0 ? ((currentStep) / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-xs mx-auto px-4">
      {/* Utiliser le composant Progress de shadcn/ui */}
      <Progress value={progressPercentage} className="h-2" aria-label={`Progression : étape ${currentStep} sur ${totalSteps}`} />
      {/* Optionnel: Afficher le texte "Étape X / Y" */}
      {/* <p className="text-xs text-center text-gray-500 mt-1">
        Étape {currentStep} / {totalSteps}
      </p> */}
    </div>
  );
};

export default ProgressBar;