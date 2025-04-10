import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Fonction simple pour formater une date (ex: 15 avril 2024)
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) {
    return ''; // Retourner vide si l'entrée est null ou undefined
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return ''; // Retourner vide si la date est invalide
  }

  try {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", dateInput, error);
    return ''; // Retourner vide en cas d'erreur de formatage
  }
}
