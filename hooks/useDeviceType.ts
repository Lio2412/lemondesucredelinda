import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Hook personnalisé pour détecter le type d'appareil (mobile, tablette, bureau)
 * basé sur la largeur de la fenêtre.
 */
export function useDeviceType(): { deviceType: DeviceType } {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    // Fonction pour vérifier et mettre à jour le type d'appareil
    const checkDeviceType = () => {
      if (window.matchMedia(breakpoints.mobile).matches) {
        setDeviceType('mobile');
      } else if (window.matchMedia(breakpoints.tablet).matches) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Vérifier au montage initial
    checkDeviceType();

    // Ajouter un écouteur pour les changements de taille de fenêtre
    const mediaQueryLists = Object.values(breakpoints).map(query => window.matchMedia(query));
    mediaQueryLists.forEach(mql => mql.addEventListener('change', checkDeviceType));

    // Nettoyer les écouteurs au démontage
    return () => {
      mediaQueryLists.forEach(mql => mql.removeEventListener('change', checkDeviceType));
    };
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'au montage et démontage

  return { deviceType };
}
