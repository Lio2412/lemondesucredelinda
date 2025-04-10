import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, StickyNote, Maximize2, ChevronLeft, ChevronRight, Clock, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface CookingModeProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    ingredients: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
    }>;
    steps: Array<{
      id: string;
      description: string;
      duration: number;
    }>;
    cookingTime: number;
    difficulty: string;
    equipment: string[];
  };
  onClose: () => void;
}

export const CookingMode = ({ recipe, onClose }: CookingModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showIngredients, setShowIngredients] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const startTimer = useCallback((duration: number) => {
    setTimeRemaining(duration * 60);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={toggleFullScreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div 
          className="flex-1 bg-card rounded-lg p-6 overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Préparation de la recette</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-accent/20 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Étape {currentStep + 1}/{recipe.steps.length}</h3>
                    <p>{recipe.steps[currentStep].description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.steps[currentStep].duration} minutes</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`step-${currentStep}`}
                      className="h-5 w-5 rounded-full"
                      checked={completedSteps.has(recipe.steps[currentStep].id)}
                      onCheckedChange={(checked: boolean) => {
                        const newCompletedSteps = new Set(completedSteps);
                        if (checked) {
                          newCompletedSteps.add(recipe.steps[currentStep].id);
                        } else {
                          newCompletedSteps.delete(recipe.steps[currentStep].id);
                        }
                        setCompletedSteps(newCompletedSteps);
                      }}
                    />
                    <label htmlFor={`step-${currentStep}`}>
                      Marquer comme terminée
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startTimer(recipe.steps[currentStep].duration)}
                    >
                      Démarrer le minuteur
                    </Button>
                    {timerActive && (
                      <div className="text-sm bg-primary/10 px-2 py-1.5 rounded-full">
                        {formatTime(timeRemaining)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <nav className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((step) => step - 1)}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStep((step) => step + 1)}
              disabled={currentStep === recipe.steps.length - 1}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </nav>
        </motion.div>
      </div>
    </div>
  );
};