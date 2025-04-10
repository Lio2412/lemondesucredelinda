import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Maximize, Minimize, Keyboard } from 'lucide-react';

interface CookingModeHeaderProps {
  recipeTitle: string;
  currentStep: number;
  totalSteps: number;
  progress: number; // Progression en pourcentage (0-100)
  onClose: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onShowShortcuts: () => void;
}

export const CookingModeHeader: React.FC<CookingModeHeaderProps> = ({
  recipeTitle,
  currentStep,
  totalSteps,
  progress,
  onClose,
  onToggleFullscreen,
  isFullscreen,
  onShowShortcuts,
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold truncate" title={recipeTitle}>
          {recipeTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>

      <div className="flex-1 mx-4 hidden md:block">
        <Progress value={progress} className="w-full" />
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onShowShortcuts} title="Afficher les raccourcis clavier (k)">
          <Keyboard className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleFullscreen} title={isFullscreen ? 'Quitter le plein écran (f)' : 'Passer en plein écran (f)'}>
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose} title="Quitter le mode cuisine (Échap)">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
