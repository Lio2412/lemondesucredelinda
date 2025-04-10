'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importer framer-motion
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, X, Expand, Shrink, Timer, Play, Pause, RotateCcw, Minus, Plus, Users, BookOpen, ShoppingCart, CheckCircle } from 'lucide-react'; // Ajout CheckCircle
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importer Tabs
// Suppression des imports Dialog car plus utilisés

// Interface pour les étapes (ID mis à jour en string)
interface Step {
  id: string; // Changé de number à string pour correspondre à Prisma
  description: string;
  duration?: number;
  ingredientsUsed?: string[]; // Ingrédients utilisés dans cette étape
}

// Interface pour les ingrédients (simplifiée)
// Doit correspondre à IngredientData dans page.tsx + id ajouté
interface Ingredient {
  id: string;
  name: string;
  quantity: number; // Quantité de base
  unit: string;
}

// Props pour le composant CookingMode
interface CookingModeProps {
  recipeTitle: string;
  steps: Step[];
  ingredients: Ingredient[]; // Ingrédients de base
  basePortions: number; // Portions de base de la recette
  onClose: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipeTitle, steps, ingredients, basePortions, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set()); // Utiliser Set<string> pour les IDs
  const [isFullscreen, setIsFullscreen] = useState(false); // État pour le plein écran
  // --- Feature 1 (Minuteur): États du minuteur ---
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerFinished, setIsTimerFinished] = useState<boolean>(false);
  // --- Feature: Gestion des portions ---
  const [currentPortions, setCurrentPortions] = useState<number>(basePortions);
  // --- Feature: Barrement des ingrédients ---
  const [strikedIngredients, setStrikedIngredients] = useState<Set<string>>(new Set());
  const [isFinishing, setIsFinishing] = useState(false); // État pour l'animation de fin

  // Utilisation de useCallback pour éviter de recréer les fonctions à chaque rendu
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const toggleStepCompletion = (stepId: string) => { // Accepter stepId comme string
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const currentStep = steps[currentStepIndex];
  const isStepCompleted = completedSteps.has(currentStep.id);
  const totalSteps = steps.length;

  // --- Feature 2: Navigation Clavier ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextStep();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrevStep, handleNextStep]); // Dépendances useCallback

  // --- Feature 3: Gestion Plein Écran ---
   const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran : ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

   // Mettre à jour l'état si l'utilisateur sort du plein écran (ex: touche Echap)
   useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);


  // --- Feature 1 (Minuteur): Logique du minuteur ---
  useEffect(() => {
    // console.log(`[Effect Timer Reset] Step ${currentStep.id}, Duration: ${currentStep.duration}`); // DEBUG removed
    // Réinitialiser le minuteur quand l'étape change
    const duration = currentStep.duration;
    if (duration && duration > 0) {
      setTimerSeconds(duration);
      setIsTimerRunning(false);
      setIsTimerFinished(false);
    } else {
      // Pas de durée pour cette étape
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setIsTimerFinished(true); // Considérer comme terminé s'il n'y a pas de minuteur
    }
     // Réinitialiser aussi l'état "terminé" de l'étape si elle n'a pas de durée
     // (car on utilise la coche pour la validation dans ce cas)
     // Si elle a une durée, on se base sur isTimerFinished
     if (!duration && completedSteps.has(currentStep.id)) {
        // Optionnel: Décocher automatiquement ? Ou laisser coché ?
        // Pour l'instant, on laisse coché si l'utilisateur l'a fait.
     }

  }, [currentStepIndex, currentStep.duration, currentStep.id, completedSteps]); // Ajouter currentStep.id et completedSteps

  useEffect(() => {
    // Gérer le décompte
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      // Le minuteur vient de se terminer
      setIsTimerRunning(false);
      setIsTimerFinished(true);
      // Optionnel: Marquer automatiquement l'étape comme terminée ?
      // setCompletedSteps(prev => new Set(prev).add(currentStep.id));
    }

    // Nettoyer l'intervalle
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timerSeconds, currentStep.id]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    if (currentStep.duration) {
      setTimerSeconds(currentStep.duration);
      setIsTimerRunning(false);
      setIsTimerFinished(false);
    }
  };

  // Formatage du temps MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- Feature 3: Logique de désactivation du bouton Suivant ---
  const isLastStep = currentStepIndex === totalSteps - 1;
  // La logique de désactivation est simplifiée pour ne bloquer que sur la dernière étape
  const isNextDisabled = isLastStep;
// --- Feature: Gestion des portions ---
const increasePortions = () => {
  setCurrentPortions(prev => Math.min(prev + 1, 12)); // Max 12 portions
};

const decreasePortions = () => {
  setCurrentPortions(prev => Math.max(prev - 1, 1)); // Min 1 portion
};

// Fonction pour calculer et formater la quantité ajustée
const formatAdjustedQuantity = (baseQuantity: number): string => {
  if (!basePortions || basePortions <= 0) return baseQuantity.toString(); // Sécurité
  const adjusted = (baseQuantity * currentPortions) / basePortions;

  // Arrondir à 1 décimale si nécessaire, sinon entier
  if (adjusted % 1 !== 0) {
    return adjusted.toFixed(1);
  }
  return adjusted.toString();
};

// --- Feature: Barrement des ingrédients ---
useEffect(() => {
  const newStriked = new Set<string>();
  steps.forEach(step => {
    // Vérifier si l'étape est complétée (utiliser l'ID string) ET si elle a des ingrédients listés
    if (completedSteps.has(step.id) && step.ingredientsUsed) {
      step.ingredientsUsed.forEach(ingName => newStriked.add(ingName));
    }
  });
  setStrikedIngredients(newStriked);
}, [completedSteps, steps]); // Recalculer quand les étapes cochées changent

// --- Feature: Finir la recette ---
const handleFinishRecipe = () => {
  console.log("Recette terminée !");
  setIsFinishing(true); // Déclencher l'animation
  // Fermer après la durée de l'animation + un petit délai
  setTimeout(() => {
    onClose();
    // Réinitialiser l'état au cas où le composant reste monté
    // setIsFinishing(false); // Pas nécessaire si onClose démonte le composant
  }, 1200); // Durée animation (ex: 1s) + délai (200ms)
};


return (
  // Overlay plein écran
    // Overlay plein écran
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      {/* Changement max-w-2xl à max-w-4xl pour accueillir la colonne ingrédients */}
      <div className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col border overflow-hidden">

        {/* En-tête du mode cuisine */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold truncate mr-2">{recipeTitle} - Mode Cuisine</h2>
          <div className="flex items-center space-x-2">
             {/* --- Feature 3: Bouton Plein Écran --- */}
            <Button variant="ghost" size="icon" onClick={toggleFullScreen} title={isFullscreen ? "Quitter le plein écran" : "Passer en plein écran"}>
              {isFullscreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Fermer le mode cuisine">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* --- Feature 1: Barre de progression --- */}
        <div className="w-full px-4 pt-2 pb-4 border-b">
          <div className="text-sm text-center text-muted-foreground mb-1">
            Étape {currentStepIndex + 1} / {totalSteps}
          </div>
          <div className="w-full h-2 bg-pink-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteneur principal avec système d'onglets */}
        <Tabs defaultValue="etapes" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="etapes">
               <BookOpen className="h-4 w-4 mr-2"/> Étapes
            </TabsTrigger>
            <TabsTrigger value="ingredients">
               <ShoppingCart className="h-4 w-4 mr-2"/> Ingrédients
            </TabsTrigger>
          </TabsList>

          {/* Contenu Onglet Étapes */}
          <TabsContent value="etapes" className="flex-grow overflow-y-auto p-4 md:p-6 bg-pink-50 dark:bg-gray-800/50 focus-visible:ring-0 focus-visible:ring-offset-0">
             {/* Animation et affichage de l'étape actuelle */}
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentStep.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3, ease: "easeOut" }}
                 className={`flex flex-col space-y-4 transition-all duration-300 ${isStepCompleted ? 'bg-green-50 dark:bg-green-900/30 ring-1 ring-green-400 dark:ring-green-600 rounded-lg p-3 -m-3 md:-m-4' : ''}`} // Ajustement padding si surligné
               >
                 <div className="flex items-start space-x-3">
                   <button
                      onClick={() => toggleStepCompletion(currentStep.id)}
                      className={`mt-1 flex-shrink-0`}
                      title={isStepCompleted ? "Marquer comme non terminée" : "Marquer comme terminée"}
                   >
                     {isStepCompleted ? (
                       <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                         <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                       </motion.div>
                     ) : (
                       <Square className="h-6 w-6 text-muted-foreground" />
                     )}
                   </button>
                   <p className={`flex-grow text-lg md:text-xl leading-relaxed ${isStepCompleted ? 'line-through text-muted-foreground' : ''}`}>
                     {currentStep.description}
                   </p>
                 </div>

                 {/* Affichage du minuteur */}
                 {typeof currentStep.duration === 'number' && currentStep.duration > 0 && (
                   <div className="flex items-center justify-center space-x-4 pt-2 border-t border-dashed mt-4">
                     <Timer className="h-6 w-6 text-pink-600" />
                     <span className={`text-2xl font-semibold tabular-nums ${isTimerFinished ? 'text-green-600' : 'text-pink-600'}`}>
                       {formatTime(timerSeconds)}
                     </span>
                     {!isTimerFinished && (
                       <>
                         {isTimerRunning ? (
                           <Button variant="outline" size="icon" onClick={pauseTimer} title="Pause"> <Pause className="h-4 w-4" /> </Button>
                         ) : (
                           <Button variant="outline" size="icon" onClick={startTimer} title="Démarrer"> <Play className="h-4 w-4" /> </Button>
                         )}
                       </>
                     )}
                     <Button variant="ghost" size="icon" onClick={resetTimer} title="Réinitialiser"> <RotateCcw className="h-4 w-4" /> </Button>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </TabsContent>

          {/* Contenu Onglet Ingrédients */}
          <TabsContent value="ingredients" className="flex-grow overflow-y-auto p-4 md:p-6 bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0">
             {/* Sélecteur de portions */}
             <div className="flex items-center justify-center space-x-3 mb-4 sticky top-0 bg-muted/50 py-2 -mx-4 px-4 border-b">
                 <Button variant="outline" size="icon" onClick={decreasePortions} disabled={currentPortions <= 1} className="h-7 w-7"> <Minus className="h-4 w-4" /> </Button>
                 <div className="text-center flex-grow">
                   <div className="flex items-center justify-center font-semibold"> <Users className="h-4 w-4 mr-1.5 text-muted-foreground"/> {currentPortions} </div>
                   <span className="text-xs text-muted-foreground"> {currentPortions > 1 ? 'personnes' : 'personne'} </span>
                 </div>
                 <Button variant="outline" size="icon" onClick={increasePortions} disabled={currentPortions >= 12} className="h-7 w-7"> <Plus className="h-4 w-4" /> </Button>
             </div>
             {/* Liste des ingrédients */}
             <ul className="space-y-1.5 text-sm">
               {ingredients.map((ingredient) => {
                 const isStriked = strikedIngredients.has(ingredient.name);
                 return (
                   <li key={ingredient.id} className={`flex justify-between items-center transition-opacity duration-300 ${isStriked ? 'opacity-50' : 'opacity-100'}`}>
                     <span className={`${isStriked ? 'line-through text-muted-foreground' : ''}`}> {ingredient.name} </span>
                     <span className={`text-right font-medium text-muted-foreground ${isStriked ? 'line-through' : ''}`}> {formatAdjustedQuantity(ingredient.quantity)} {ingredient.unit} </span>
                   </li>
                 );
               })}
             </ul>
             {/* Indicateur si tous les ingrédients sont utilisés */}
             {strikedIngredients.size === ingredients.length && ingredients.length > 0 && (
                <p className="text-xs text-center text-green-600 mt-4 font-medium">Ingrédients utilisés ✔️</p>
             )}
          </TabsContent>
        </Tabs>

        {/* Pied de page (navigation) */}
        <div className="flex justify-between items-center p-4 border-t bg-muted/50">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStepIndex === 0}>
            Précédent
          </Button>

          {/* Bouton Suivant ou Finir */}
          {isLastStep ? (
             <motion.div // Conteneur pour l'animation
                animate={isFinishing ? { scale: [1, 1.1, 1], transition: { duration: 0.4 } } : {}}
             >
               <Button
                 onClick={handleFinishRecipe}
                 disabled={isFinishing} // Désactiver pendant l'animation
                 className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ${isFinishing ? 'px-4' : 'px-3'}`} // Ajuster padding pour icône
               >
                 {isFinishing ? (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.1, duration: 0.3 }}
                     className="flex items-center justify-center"
                   >
                     <CheckCircle className="h-5 w-5 mr-2" /> Terminé !
                   </motion.div>
                 ) : (
                   '🎉 Finir la recette'
                 )}
               </Button>
             </motion.div>
          ) : (
             <Button onClick={handleNextStep}>
               Suivant
             </Button>
          )}
        </div>
      </div>
    </div>
  );
};