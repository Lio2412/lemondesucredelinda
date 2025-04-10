'use client';

import { useState, useEffect } from 'react';

// Type pour un élément de l'historique
interface HistoryItem {
  id: string | number;
  slug: string;
  title: string;
  lastVisited: Date;
}

// Type pour le retour du hook
interface UseRecipeHistoryReturn {
  history: HistoryItem[];
  addToHistory: (recipe: { id: string | number; slug: string; title: string }) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string | number) => void;
}

// Clé pour le stockage local
const HISTORY_STORAGE_KEY = 'recipe-history';

/**
 * Hook pour gérer l'historique des recettes consultées
 * Stocke l'historique dans le localStorage
 */
export function useRecipeHistory(): UseRecipeHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Charger l'historique au montage du composant
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        // Convertir les dates de chaîne en objets Date
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          lastVisited: new Date(item.lastVisited)
        }));
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des recettes:', error);
    }
  }, []);

  // Sauvegarder l'historique lorsqu'il change
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique des recettes:', error);
    }
  }, [history]);

  // Ajouter une recette à l'historique
  const addToHistory = (recipe: { id: string | number; slug: string; title: string }) => {
    setHistory(prevHistory => {
      // Vérifier si la recette est déjà dans l'historique
      const existingIndex = prevHistory.findIndex(item => item.id === recipe.id);
      
      // Créer le nouvel élément d'historique
      const newItem: HistoryItem = {
        ...recipe,
        lastVisited: new Date()
      };
      
      // Si la recette existe déjà, la mettre à jour et la déplacer en haut
      if (existingIndex !== -1) {
        const newHistory = [...prevHistory];
        newHistory.splice(existingIndex, 1);
        return [newItem, ...newHistory];
      }
      
      // Sinon, ajouter la nouvelle recette en haut (limiter à 20 éléments)
      return [newItem, ...prevHistory].slice(0, 20);
    });
  };

  // Effacer tout l'historique
  const clearHistory = () => {
    setHistory([]);
  };

  // Supprimer une recette spécifique de l'historique
  const removeFromHistory = (id: string | number) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  return { history, addToHistory, clearHistory, removeFromHistory };
}
