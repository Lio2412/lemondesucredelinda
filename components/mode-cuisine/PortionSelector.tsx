import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Utilisation potentielle, mais boutons +/- sont plus courants
import { MinusIcon, PlusIcon } from 'lucide-react'; // Icônes pour les boutons

type PortionSelectorProps = {
  basePortions: number;
  currentPortions: number;
  onPortionChange: (newPortions: number) => void;
};

const PortionSelector: React.FC<PortionSelectorProps> = ({
  basePortions,
  currentPortions,
  onPortionChange,
}) => {
  const handleDecrement = () => {
    if (currentPortions > 1) {
      onPortionChange(currentPortions - 1);
    }
  };

  const handleIncrement = () => {
    // Optionnel: Mettre une limite supérieure si nécessaire
    onPortionChange(currentPortions + 1);
  };

  // Afficher une indication si les portions sont différentes de la base
  const portionInfo = basePortions !== currentPortions
    ? `(Recette de base pour ${basePortions})`
    : '';

  return (
    <div className="flex items-center justify-center space-x-3 bg-gray-100 p-3 rounded-full border border-gray-200">
       <span className="text-sm font-medium text-gray-600 mr-2">Portions :</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={currentPortions <= 1}
        aria-label="Diminuer le nombre de portions"
        className="rounded-full w-8 h-8"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold text-gray-800 min-w-[30px] text-center">
        {currentPortions}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        aria-label="Augmenter le nombre de portions"
        className="rounded-full w-8 h-8"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
       {portionInfo && <span className="text-xs text-gray-500 ml-2">{portionInfo}</span>}
    </div>
  );
};

export default PortionSelector;