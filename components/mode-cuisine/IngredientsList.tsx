import React from 'react';
import { Checkbox } from '@/components/ui/checkbox'; // Utilisation de shadcn/ui Checkbox
import { Label } from '@/components/ui/label'; // Utilisation de shadcn/ui Label
import { Ingredient } from './ModeCuisine'; // Importer le type Ingredient

type IngredientsListProps = {
  ingredients: Ingredient[];
  checkedIngredients: string[];
  onToggleIngredient: (ingredientName: string) => void;
};

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  checkedIngredients,
  onToggleIngredient,
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Ingrédients</h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => {
          const isChecked = checkedIngredients.includes(ingredient.name);
          // Formatter la quantité pour un affichage plus propre (ex: 0.5 au lieu de 0,5000001)
          const formattedQuantity = Number.isInteger(ingredient.quantity)
            ? ingredient.quantity
            : ingredient.quantity.toFixed(1); // Ajuster la précision si nécessaire

          return (
            <li key={ingredient.name} className="flex items-center space-x-3">
              <Checkbox
                id={`ingredient-${ingredient.name}`}
                checked={isChecked}
                onCheckedChange={() => onToggleIngredient(ingredient.name)}
                aria-label={`Marquer ${ingredient.name} comme utilisé`}
              />
              <Label
                htmlFor={`ingredient-${ingredient.name}`}
                className={`flex-1 text-sm ${
                  isChecked ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {formattedQuantity} {ingredient.unit} {ingredient.name}
              </Label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default IngredientsList;