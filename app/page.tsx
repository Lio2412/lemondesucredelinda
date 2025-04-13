export const revalidate = 0; // Désactiver la mise en cache des données pour la page d'accueil
// 'use client'; // Retiré pour transformer en Server Component

import type { Metadata } from 'next';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import LastCreations from '@/components/creations/LastCreations';
import HeroSection from '@/components/home/HeroSection'; // Importer le nouveau composant client
import { getLastCreations } from '@/lib/data/creations'; // Importer la fonction de récupération des données
import { getPublishedRecipes } from '@/lib/data/recipes'; // Importer la fonction pour les recettes publiées

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], // Inclure les poids utilisés
  display: 'swap',
});

// L'interface Recipe locale et les données mockées featuredRecipes sont supprimées.
// Nous utiliserons les données récupérées par getPublishedRecipes.



export const generateMetadata = (): Metadata => ({
  title: "Accueil - Le Monde Sucré de Linda",
  description: "Des recettes et créations sucrées 100% maison 🍓",

  openGraph: {
    title: "Le Monde Sucré de Linda",
    description: "Des recettes gourmandes, créatives et accessibles à tous 🍰",
    url: "https://lemondesucredelinda.com", // TODO: Vérifier si l'URL est correcte ou doit être dynamique/configurée
    siteName: "Le Monde Sucré de Linda",
    images: [
      {
        url: "https://lemondesucredelinda.com/og-banner.jpg", // TODO: L'utilisateur doit s'assurer que cette image existe et est accessible publiquement
        width: 1200,
        height: 630,
        alt: "Bannière Le Monde Sucré de Linda",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Le Monde Sucré de Linda",
    description: "Recettes maison & inspirations sucrées ✨",
    images: ["https://lemondesucredelinda.com/og-banner.jpg"], // TODO: L'utilisateur doit s'assurer que cette image existe et est accessible publiquement
  },
})


// Rendre le composant Home asynchrone pour utiliser await
export default async function Home() {
  // Récupérer les données des dernières créations côté serveur
  const lastCreationsData = await getLastCreations(3);
  const publishedRecipesData = await getPublishedRecipes(3); // Récupérer les recettes publiées

  return (
    <main className="min-h-screen bg-white">
      {/* Utiliser le composant client HeroSection */}
      <HeroSection />

      {/* === Section Dernières Créations === */}
      <LastCreations creations={lastCreationsData} /> {/* Passer les données récupérées */}

      {/* === Section Recettes en Vedette === */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Titre de section */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-light mb-4 text-gray-900 ${playfairDisplay.className}`}>
              Nos Meilleures Recettes
            </h2>
            <div className="w-20 h-px bg-pink-600 mx-auto"></div> {/* Ajustement couleur thème */}
          </div>
          {/* Grille des recettes */}
          <div className="grid md:grid-cols-3 gap-8">
            {publishedRecipesData.map((recipe) => {
              // Calcul du temps total
              const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
              const hours = Math.floor(totalTime / 60);
              const minutes = totalTime % 60;
              const timeString = `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? `${minutes}min` : ''}` || 'N/A';

              return (
                <article key={recipe.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/recettes/${recipe.slug}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={recipe.image || '/images/placeholder.png'} // Utiliser l'image de la recette ou un placeholder
                        alt={recipe.title}
                        width={800}
                        height={450}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {recipe.category && (
                        <div className="absolute top-0 right-0 bg-pink-600 text-white text-xs px-2 py-1 m-2 rounded">
                          {recipe.category}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={`text-xl mb-2 group-hover:text-pink-600 transition-colors ${playfairDisplay.className}`}>
                        {recipe.title}
                      </h3>
                      {recipe.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{recipe.difficulty || 'N/A'}</span>
                        <span>{timeString}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          {/* Bouton pour voir toutes les recettes */}
          <div className="text-center mt-8">
            <Link
              href="/recettes"
              className="inline-flex items-center px-6 py-3 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-colors duration-300" /* Ajustement couleur thème */
            >
              Voir toutes les recettes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}