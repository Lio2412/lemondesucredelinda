import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react'; // Icône pour indiquer le succès

type FinishRecipeProps = {
  onRestart: () => void; // Fonction pour recommencer la recette
};

const FinishRecipe: React.FC<FinishRecipeProps> = ({ onRestart }) => {
  return (
    <div className="text-center p-8 flex flex-col items-center justify-center bg-green-50 rounded-lg border border-green-200">
      {/* Animation simple ou icône */}
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-pulse" />

      <h2 className="text-2xl font-bold text-green-800 mb-3">
        Recette terminée !
      </h2>
      <p className="text-gray-600 mb-6">
        Félicitations ! Vous avez terminé toutes les étapes. Bon appétit !
      </p>
      <Button onClick={onRestart} variant="outline" size="lg">
        Recommencer la recette
      </Button>
    </div>
  );
};

export default FinishRecipe;