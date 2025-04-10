import React, { useState } from 'react';
import IngredientsList from './IngredientsList';
import StepDisplay from './StepDisplay';
import PortionSelector from './PortionSelector';
import ProgressBar from './ProgressBar';
import FinishRecipe from './FinishRecipe';
import { Button } from '@/components/ui/button'; // Assumant l'utilisation de shadcn/ui Button

// Définition des types (comme spécifié dans la demande)
type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

type Step = {
  title?: string;
  content: string;
  duration?: number; // en minutes
  ingredientsUsed?: string[];
};

type ModeCuisineProps = {
  title: string;
  basePortions: number;
  ingredients: Ingredient[];
  steps: Step[];
};

const ModeCuisine: React.FC<ModeCuisineProps> = ({
  title,
  basePortions,
  ingredients: initialIngredients,
  steps,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [portions, setPortions] = useState(basePortions);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  const handlePortionChange = (newPortions: number) => {
    setPortions(newPortions);
    // Recalculer les quantités d'ingrédients si nécessaire (logique à affiner)
  };

  const handleIngredientToggle = (ingredientName: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((name) => name !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isFinished = currentStepIndex === steps.length;

  // Ajuster les quantités d'ingrédients en fonction des portions
  const adjustedIngredients = initialIngredients.map((ing) => ({
    ...ing,
    quantity: (ing.quantity / basePortions) * portions,
  }));

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-white rounded-lg shadow-lg my-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h1>

      {!isFinished ? (
        <>
          <div className="mb-6 flex justify-center">
            <PortionSelector
              basePortions={basePortions}
              currentPortions={portions}
              onPortionChange={handlePortionChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <IngredientsList
                ingredients={adjustedIngredients}
                checkedIngredients={checkedIngredients}
                onToggleIngredient={handleIngredientToggle}
              />
            </div>

            <div className="md:col-span-2">
              <StepDisplay
                step={steps[currentStepIndex]}
                stepNumber={currentStepIndex + 1}
                totalSteps={steps.length}
              />
              <div className="mt-6 flex justify-between items-center">
                <Button onClick={goToPreviousStep} disabled={currentStepIndex === 0} variant="outline">
                  Précédent
                </Button>
                <ProgressBar currentStep={currentStepIndex + 1} totalSteps={steps.length} />
                <Button onClick={goToNextStep} disabled={currentStepIndex === steps.length - 1}>
                  Suivant
                </Button>
              </div>
               {/* Placeholder pour le minuteur si une durée est définie */}
               {steps[currentStepIndex]?.duration && (
                 <div className="mt-4 text-center text-gray-600">
                   Minuteur: {steps[currentStepIndex].duration} min (Fonctionnalité à implémenter)
                 </div>
               )}
            </div>
          </div>
           {/* Bouton pour marquer la fin (avant la vue FinishRecipe) */}
           {currentStepIndex === steps.length - 1 && (
             <div className="text-center mt-8">
               <Button onClick={() => setCurrentStepIndex(steps.length)} size="lg">
                 Terminer la recette !
               </Button>
             </div>
           )}
        </>
      ) : (
        <FinishRecipe onRestart={() => setCurrentStepIndex(0)} />
      )}
    </div>
  );
};

export default ModeCuisine;
export type { Ingredient, Step, ModeCuisineProps }; // Exporter les types pour réutilisation