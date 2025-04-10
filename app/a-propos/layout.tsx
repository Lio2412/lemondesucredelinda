import type { Metadata } from 'next';
import React from 'react';

// Métadonnées pour la page "À propos"
export const metadata: Metadata = {
  title: 'À Propos - Le Monde Sucré de Linda',
  description: 'Découvrez l\'histoire et la passion derrière le blog Le Monde Sucré de Linda.',
  // Vous pouvez ajouter d'autres métadonnées ici (open graph, etc.)
};

// Layout simple qui rend les enfants (la page)
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Rend simplement la page enfant
}