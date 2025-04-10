import { useState, useCallback, useEffect } from 'react';

/**
 * Interface décrivant l'état et les fonctions retournés par le hook useFullscreen.
 */
interface FullscreenState {
  isFullscreen: boolean;
  /** Fonction pour basculer l'état plein écran. */
  toggle: () => Promise<void>;
  /** Fonction pour entrer en mode plein écran. */
  enter: () => Promise<void>;
  /** Fonction pour sortir du mode plein écran. */
  exit: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer le mode plein écran d'un élément ou de la page entière.
 *
 * @param {React.RefObject<HTMLElement | null>} elementRef - Référence optionnelle vers l'élément à mettre en plein écran. Par défaut, utilise document.documentElement.
 * @returns {FullscreenState} - État et fonctions pour contrôler le plein écran.
 */
function useFullscreen(
  elementRef: React.RefObject<HTMLElement | null> = { current: null } // Initialiser à null pour éviter les erreurs côté serveur
): FullscreenState {
  // Initialiser l'état en vérifiant si document existe (pour SSR/Next.js)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    typeof document !== 'undefined' ? !!document.fullscreenElement : false
  );

  // Callback pour gérer le changement d'état du plein écran
  const handleFullscreenChange = useCallback(() => {
    if (typeof document !== 'undefined') {
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  // Effet pour ajouter/supprimer l'écouteur d'événement
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      // Nettoyage :
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, [handleFullscreenChange]);

  // Fonction pour entrer en plein écran
  const enter = useCallback(async () => {
    // Vérifier si l'API est disponible et si nous sommes côté client
    if (typeof document === 'undefined') return;

    const element = elementRef.current ?? document.documentElement;

    if (element.requestFullscreen) {
      try {
        await element.requestFullscreen();
        // L'état sera mis à jour par l'event listener
      } catch (error) {
        console.error('Erreur lors de la tentative de passage en plein écran:', error);
        setIsFullscreen(false); // Assurer la cohérence de l'état en cas d'erreur immédiate
      }
    } else {
      console.warn("L'API Plein écran (requestFullscreen) n'est pas supportée ou l'élément est invalide.");
    }
  }, [elementRef]);

  // Fonction pour sortir du plein écran
  const exit = useCallback(async () => {
    // Vérifier si l'API est disponible et si nous sommes côté client
    if (typeof document === 'undefined' || !document.fullscreenElement) return;

    if (document.exitFullscreen) {
      try {
        await document.exitFullscreen();
        // L'état sera mis à jour par l'event listener
      } catch (error) {
        console.error('Erreur lors de la tentative de sortie du plein écran:', error);
      }
    } else {
      console.warn("L'API Plein écran (exitFullscreen) n'est pas supportée.");
    }
  }, []);

  // Fonction pour basculer le mode plein écran
  const toggle = useCallback(async () => {
    if (isFullscreen) {
      await exit();
    } else {
      await enter();
    }
  }, [isFullscreen, enter, exit]);

  return { isFullscreen, toggle, enter, exit };
}

export default useFullscreen;
