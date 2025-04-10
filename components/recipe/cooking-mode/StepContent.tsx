import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StepContentProps {
  stepIndex: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const StepContent: React.FC<StepContentProps> = ({ stepIndex, instruction, isCompleted, onToggleComplete }) => {
  const checkboxId = `step-${stepIndex}-complete`;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {/* Checkbox pour marquer l'étape comme terminée */}
        <Checkbox
          id={checkboxId}
          checked={isCompleted}
          onCheckedChange={onToggleComplete}
        />
        <Label htmlFor={checkboxId} className={`text-sm font-medium leading-none ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
          Marquer comme terminée
        </Label>
      </div>

      {/* Affichage de l'instruction de l'étape */}
      <div className={`prose prose-sm max-w-none ${isCompleted ? 'text-muted-foreground' : ''}`}>
        <p>{instruction || "Instruction de l'étape non disponible."}</p>
      </div>

      {/* Placeholder pour des éléments futurs (ex: notes, timer spécifique à l'étape) */}
      {/* ... */}
    </div>
  );
};
