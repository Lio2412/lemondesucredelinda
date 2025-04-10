'use client';

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Wrench } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Ingredient } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface IngredientsListProps {
  ingredients: Ingredient[];
  equipment?: string[];
  initialServings: number;
  servings: number;
  onToggleIngredient?: (index: number) => void;
  completedIngredients?: Set<number>;
  onClose?: () => void;
  currentStepIndex?: number;
}

// -- Helper Functions --

// Fonction pour formater la quantité (peut retourner un nombre ou une fraction)
const formatQuantity = (quantity: number | null): string => {
  if (quantity === null || quantity === undefined) return '';
  const roundedQuantity = Math.round(quantity * 100) / 100;
  const integerPart = Math.floor(roundedQuantity);
  const decimalPart = roundedQuantity - integerPart;
  const fractions: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾', '0.33': '⅓', '0.66': '⅔', '0.67': '⅔' };
  for (const [decimal, fraction] of Object.entries(fractions)) {
    if (Math.abs(decimalPart - parseFloat(decimal)) < 0.01) {
      return integerPart > 0 ? `${integerPart} ${fraction}` : fraction;
    }
  }
  const formattedNumber = Number.isInteger(roundedQuantity) ? roundedQuantity.toString() : roundedQuantity.toFixed(2).replace(/\.?0+$/, '');
  return formattedNumber;
};

// Fonction pour extraire quantité, unité et nom d'une chaîne d'ingrédient
const parseIngredient = (ingredient: string): { quantity: number | undefined; unit: string; name: string } => {
  const regex = /^\s*(?:(\d+(?:[.,\/]\d+)?)\s*([a-zA-Zµ]+(?:\(s\))?)?\s*)?(.*)$/i;
  const match = ingredient.match(regex);
  if (!match) { return { quantity: undefined, unit: '', name: ingredient.trim() }; }
  const [, quantityStr, unitStr, nameStr] = match;
  let quantity: number | undefined = undefined;
  if (quantityStr) {
    const normalizedQuantityStr = quantityStr.replace(',', '.');
    if (normalizedQuantityStr.includes('/')) {
      const parts = normalizedQuantityStr.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) { quantity = numerator / denominator; }
      }
    } else {
      const parsedFloat = parseFloat(normalizedQuantityStr);
      if (!isNaN(parsedFloat)) { quantity = parsedFloat; }
    }
  }
  return { quantity, unit: unitStr?.trim() || '', name: nameStr?.trim() || '' };
};

export function IngredientsList({
  ingredients,
  equipment,
  initialServings,
  servings,
  onToggleIngredient,
  completedIngredients = new Set<number>(),
  onClose,
  currentStepIndex
}: IngredientsListProps) {
  const [progress, setProgress] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ingredients?.length) { setProgress(0); }
    else { setProgress((completedIngredients.size / ingredients.length) * 100); }
  }, [ingredients, completedIngredients]);

  // Define the type for the adjusted ingredient object explicitly
  type AdjustedIngredient =
      | { text: string; name?: undefined; adjustedQuantityFormatted?: undefined; unit?: undefined } // Type for simple text ingredient
      | { text?: undefined; name: string; adjustedQuantityFormatted: string; unit: string; originalQuantity?: number; originalText: string }; // Type for full ingredient

  const adjustedIngredients = useMemo<AdjustedIngredient[]>(() => {
    if (!ingredients) return [];
    return ingredients.map((ingredient) => {
      let ingredientObj: Ingredient;
      let originalText = '';
      if (typeof ingredient === 'string') {
        const parsed = parseIngredient(ingredient);
        ingredientObj = { name: parsed.name, quantity: parsed.quantity, unit: parsed.unit };
        originalText = ingredient;
      } else { ingredientObj = ingredient; originalText = `${ingredient.quantity || ''}${ingredient.unit ? ' ' + ingredient.unit : ''} ${ingredient.name}`; }

      if (!ingredientObj.quantity || !initialServings) {
          // Return the simple text shape if no quantity or initialServings
          return { text: ingredientObj.name || originalText };
      }
      const scale = servings / initialServings;
      const adjustedQuantityValue = ingredientObj.quantity * scale;
      const adjustedQuantityFormatted = formatQuantity(adjustedQuantityValue);
      // Return the full ingredient shape
      return { name: ingredientObj.name, adjustedQuantityFormatted, unit: ingredientObj.unit || '', originalQuantity: ingredientObj.quantity, originalText };
    });
  }, [ingredients, servings, initialServings]);

  const rowVirtualizer = useVirtualizer({
    count: adjustedIngredients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const handleToggleIngredient = useCallback((index: number) => {
    if (onToggleIngredient) { onToggleIngredient(index); }
  }, [onToggleIngredient]);

  const hasIngredients = ingredients && ingredients.length > 0;
  const hasEquipment = equipment && equipment.length > 0;

  if (!hasIngredients && !hasEquipment) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Aucun ingrédient ou équipement disponible.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des ingrédients</CardTitle>
        <p className="text-sm text-muted-foreground">
            Pour {servings} {servings > 1 ? 'portions' : 'portion'}
        </p>
      </CardHeader>
      <CardContent className="p-0">
         {hasIngredients ? (
           <>
            <div className="px-4 pt-2 pb-1">
              <Progress value={progress} className="w-full h-2" />
            </div>
            <div
              ref={parentRef}
              className="overflow-y-auto relative"
              style={{ height: `${Math.min(300, adjustedIngredients.length * 40)}px` }}
            >
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const index = virtualRow.index;
                  const ingredient = adjustedIngredients[index];
                  const isCompleted = completedIngredients.has(index);
                  const checkboxId = `ingredient-${index}`;

                  // Type Guard: Check if it's a full ingredient object
                  if ('name' in ingredient) {
                    return (
                        <div
                          key={virtualRow.key}
                          data-index={index}
                          ref={rowVirtualizer.measureElement}
                          className="flex items-center space-x-3 px-4 py-2 absolute top-0 left-0 w-full"
                          style={{ transform: `translateY(${virtualRow.start}px)` }}
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={isCompleted}
                            onCheckedChange={() => handleToggleIngredient(index)}
                            aria-label={`Marquer ${ingredient.name} comme utilisé`}
                          />
                          <label
                            htmlFor={checkboxId}
                            className={cn(
                              'text-sm flex-1 cursor-pointer',
                              isCompleted ? 'line-through text-muted-foreground' : ''
                            )}
                          >
                            {ingredient.adjustedQuantityFormatted && (
                              <span className="font-medium mr-1">{ingredient.adjustedQuantityFormatted}</span>
                            )}
                            {ingredient.unit && (
                              <span className="text-muted-foreground mr-1">{ingredient.unit}</span>
                            )}
                            <span>{ingredient.name}</span>
                          </label>
                        </div>
                    );
                  } else if ('text' in ingredient) {
                      // Render simple text ingredient
                      return (
                          <div
                              key={virtualRow.key}
                              data-index={index}
                              ref={rowVirtualizer.measureElement}
                              className="flex items-center px-4 py-2 absolute top-0 left-0 w-full text-sm text-muted-foreground italic"
                              style={{ transform: `translateY(${virtualRow.start}px)`, paddingLeft: '2.25rem' }} // Align with checkbox text
                          >
                              {ingredient.text}
                          </div>
                      );
                  }
                  return null; // Should not happen with AdjustedIngredient type
                })}
              </div>
            </div>
            </>
          ) : (
            <p className="px-4 py-2 text-sm text-muted-foreground">Aucun ingrédient.</p>
          )}

         {/* Section Équipement */}
         {hasEquipment && (
            <>
                <Separator className="my-4" />
                <div className="px-4 pb-4">
                    <h4 className="mb-2 text-md font-semibold flex items-center">
                        <Wrench className="h-4 w-4 mr-2" />
                        Équipement nécessaire
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {equipment.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}