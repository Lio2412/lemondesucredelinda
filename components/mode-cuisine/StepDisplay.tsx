import React from 'react';
import { Step } from './ModeCuisine'; // Importer le type Step

type StepDisplayProps = {
  step: Step;
  stepNumber: number;
  totalSteps: number;
};

const StepDisplay: React.FC<StepDisplayProps> = ({ step, stepNumber, totalSteps }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {step.title ? step.title : `Étape ${stepNumber}`}
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {stepNumber} / {totalSteps}
        </span>
      </div>
      <div className="prose prose-sm max-w-none flex-grow text-gray-700">
        {/* Utiliser 'prose' de Tailwind pour un formatage de texte agréable */}
        <p>{step.content}</p>
      </div>
      {/* Optionnel: Afficher les ingrédients utilisés pour cette étape */}
      {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Ingrédients utilisés :</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {step.ingredientsUsed.map((ingredientName) => (
              <li key={ingredientName}>{ingredientName}</li>
            ))}
          </ul>
        </div>
      )}
       {/* Placeholder pour le minuteur - la logique sera dans ModeCuisine */}
       {step.duration && (
         <div className="mt-4 text-sm text-center text-blue-600 font-medium">
           Temps estimé : {step.duration} min
         </div>
       )}
    </div>
  );
};

export default StepDisplay;