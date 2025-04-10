import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Recipe } from '@/types/recipe';
import { StepContent } from '@/components/recipe/cooking-mode/StepContent';
import { CookingModeHeader } from '@/components/recipe/cooking-mode/CookingModeHeader';
import { NavigationControls } from '@/components/recipe/cooking-mode/NavigationControls';
import { StepTimer } from '@/components/recipe/cooking-mode/StepTimer';
import { IngredientsList } from '@/components/recipe/cooking-mode/IngredientsList';
import useFullscreen from '@/hooks/useFullscreen';
import { useStepCompletion } from '@/hooks/useStepCompletion';
import { KeyboardShortcutsDialog } from '@/components/recipe/cooking-mode/KeyboardShortcutsDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const defaultRecipe: Recipe = {
  id: 'default-recipe', 
  title: 'Chargement...',
  description: '',
  ingredients: [],
  instructions: [],
  preparationTime: 0,
  cookingTime: 0,
  servings: 1, 
  equipment: [],
};

interface RecipeCookingModeProps {
  initialRecipeData: Recipe | null | undefined;
  onClose: () => void;
}

export const RecipeCookingMode: React.FC<RecipeCookingModeProps> = ({ initialRecipeData, onClose }) => {
  const initialRecipe = initialRecipeData || defaultRecipe;
  const totalSteps = initialRecipe.instructions?.length ?? 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [servings, setServings] = useState(initialRecipe.servings);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showLeaveConfirmDialog, setShowLeaveConfirmDialog] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const cookingModeRef = useRef<HTMLDivElement>(null);

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(cookingModeRef);
  const { completedSteps, toggleStep, isStepCompleted, resetCompletion, progress } = useStepCompletion({
    recipeId: initialRecipe.id !== undefined ? String(initialRecipe.id) : undefined,
    totalSteps: totalSteps,
  });

  const isDirty = false; 
  const resetDirty = () => {}; 
  const undo = () => {}; 
  const redo = () => {}; 
  const canUndo = false; 
  const canRedo = false; 

  const shortcuts = useMemo(() => [
    { key: 'ArrowRight', description: 'Étape suivante' },
    { key: 'ArrowLeft', description: 'Étape précédente' },
    { key: 'f', description: 'Basculer en plein écran' },
    { key: 'k', description: 'Afficher/Masquer les raccourcis clavier' },
    { key: 'c', description: "Marquer/Démarquer l'étape comme terminée" },
  ], []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => (prev !== null ? Math.max(0, prev - 1) : 0));
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      console.log('Timer finished');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining]);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowFinishDialog(true);
    }
  }, [currentStepIndex, totalSteps]);

  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const handleGoToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  }, [totalSteps]);

  const handleCloseRequest = useCallback(() => { 
    if (isDirty) {
      setShowLeaveConfirmDialog(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const confirmLeave = useCallback(() => {
    resetDirty(); 
    onClose();
    setShowLeaveConfirmDialog(false);
  }, [onClose]); 

  const cancelLeave = useCallback(() => {
    setShowLeaveConfirmDialog(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsTimerRunning(prev => !prev);
    console.log('Timer toggled');
  }, []);

  const currentInstruction = initialRecipe.instructions?.[currentStepIndex] || '';

  return (
    <div ref={cookingModeRef} className={`flex flex-col h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CookingModeHeader
        recipeTitle={initialRecipe.title ?? 'Recette sans titre'}
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        progress={progress} 
        onClose={handleCloseRequest} 
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onShowShortcuts={() => setShowKeyboardShortcuts(true)}
      />

      <main className="flex-grow overflow-y-auto p-4 flex flex-col md:flex-row md:gap-4">
        <aside className="hidden md:block md:w-1/3 lg:w-1/4 space-y-4 sticky top-0 h-fit">
          <IngredientsList
            ingredients={initialRecipe.ingredients || []}
            equipment={initialRecipe.equipment || []}
            servings={servings ?? 1}
            initialServings={initialRecipe.servings ?? 1}
            completedIngredients={completedSteps} 
            currentStepIndex={currentStepIndex}
          />
        </aside>

        <div className="flex-grow md:w-2/3 lg:w-3/4">
          <Card className="mb-4">
            <CardContent className="p-4">
              <StepContent
                stepIndex={currentStepIndex}
                instruction={currentInstruction}
                isCompleted={isStepCompleted(currentStepIndex)}
                onToggleComplete={() => toggleStep(currentStepIndex)}
              />
              <StepTimer 
                duration={300} // Valeur par défaut, à adapter selon la durée de l'étape
                isRunning={isTimerRunning}
                onToggle={toggleTimer}
                onReset={() => console.log('Timer reset')}
                onComplete={() => console.log('Timer completed')}
              />
            </CardContent>
          </Card>
          <div className="md:hidden space-y-4">
            <IngredientsList
              ingredients={initialRecipe.ingredients || []}
              equipment={initialRecipe.equipment || []}
              servings={servings ?? 1}
              initialServings={initialRecipe.servings ?? 1}
              completedIngredients={completedSteps} 
              currentStepIndex={currentStepIndex}
            />
          </div>
        </div>
      </main>

      <footer className="p-4 border-t bg-background sticky bottom-0">
        <NavigationControls
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
          onGoToStep={handleGoToStep}
          isStepCompleted={isStepCompleted} 
        />
      </footer>

      <KeyboardShortcutsDialog
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
        shortcuts={shortcuts} 
      />

      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recette terminée !</AlertDialogTitle>
            <AlertDialogDescription>
              Félicitations, vous avez terminé la recette "{initialRecipe.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowFinishDialog(false);
              resetCompletion(); 
              onClose();
            }}>
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLeaveConfirmDialog} onOpenChange={setShowLeaveConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter le mode cuisine ?</AlertDialogTitle>
            <AlertDialogDescription>
              {isDirty ? "Des modifications n'ont peut-être pas été enregistrées." : "Êtes-vous sûr de vouloir quitter ? Votre progression sera sauvegardée."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLeave}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave}>Quitter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};