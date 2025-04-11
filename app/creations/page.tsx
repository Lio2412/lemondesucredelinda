// Ce composant redevient un Server Component

import { getAllCreations } from '@/lib/data/creations'; // Importer la fonction de récupération
import { Metadata } from 'next';
import AnimatedTitle from '@/components/creations/AnimatedTitle'; // Importer le composant client pour le titre
import { Playfair_Display } from 'next/font/google';
import CreationsGrid from '@/components/creations/CreationsGrid'; // Importer le composant client

// Métadonnées pour la page (SEO et titre de l'onglet)
export const metadata: Metadata = {
  title: 'Mes Créations | Le Monde Sucré de Linda',
  description: 'Découvrez toutes les créations pâtissières de Linda.',
};

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'], // Poids utilisé pour le titre
  display: 'swap',
});

// Rendre le composant asynchrone pour pouvoir utiliser await
const CreationsPage = async () => {
  try {
    // Récupérer les créations
    const allCreations = await getAllCreations();

    // Trier les créations par date de création (createdAt), les plus récentes en premier
    const sortedCreations = [...allCreations].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime() // Utiliser createdAt
    );

    return (
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16"> {/* Harmonisation exacte du padding vertical avec /recettes */}
        {/* Titre de section avec style similaire à la page d'accueil */}
        {/* Section Titre harmonisée */}
        <section className="mb-12 text-center">
          <div className="max-w-3xl mx-auto"> {/* Conteneur max-width comme sur /recettes */}
            {/* Titre animé (maintenant harmonisé via le composant) */}
            <AnimatedTitle title="Mes Créations" />
            {/* Séparateur */}
            <div className="w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"></div>
            {/* Paragraphe de description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Découvrez toutes les créations pâtissières de Linda.
            </p>
            {/* Note: Pas de barre de recherche ici */}
          </div>
        </section>

        {/* Utilisation du composant client pour la grille animée */}
        <CreationsGrid creations={sortedCreations} />

        {/* Message si aucune création n'est trouvée */}
        {sortedCreations.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            Aucune création à afficher pour le moment. Revenez bientôt !
          </p>
        )}
      </div>
    );
  } catch (error) {
    // Gérer l'erreur - afficher une page d'erreur conviviale
    console.error("Erreur lors du chargement des créations:", error);
    
    return (
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16 text-center">
        <section className="mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Mes Créations</h1>
            <div className="w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"></div>
          </div>
        </section>
        
        <div className="p-8 rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Oups ! Un problème est survenu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nous ne pouvons pas afficher les créations pour le moment. Veuillez réessayer plus tard.
          </p>
          <p className="text-gray-500 italic text-sm">
            Notre équipe a été informée du problème et travaille à le résoudre.
          </p>
        </div>
      </div>
    );
  }
};

export default CreationsPage;