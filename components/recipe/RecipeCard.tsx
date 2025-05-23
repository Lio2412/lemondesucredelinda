import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, BarChart } from 'lucide-react'; // Icônes pour temps/difficulté
import type { RecipeCategory } from '@prisma/client'; // Importer RecipeCategory

// Interface pour les props du composant RecipeCard
interface RecipeCardProps {
  id: string; // Ajout de l'ID
  title: string;
  // slug: string; // Supprimé
  image: string;
  description?: string; // Ajouté pour plus de détails
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  category?: RecipeCategory; // Type mis à jour vers l'enum
}

// Police Playfair Display (peut être importée globalement ou ici si nécessaire)
import { Playfair_Display } from 'next/font/google';
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id, // Ajout de l'ID
  title,
  // slug, // Supprimé
  image,
  description,
  difficulty,
  prepTime,
  cookTime,
  category,
}) => {
  const totalTime = (prepTime || 0) + (cookTime || 0);

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border dark:border-gray-700">
      {/* Mettre à jour le lien pour utiliser l'ID */}
      <Link href={`/recettes/${id}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill // Utiliser fill pour remplir le conteneur
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badge Catégorie (si fourni) */}
          {category && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-pink-600 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow">
              {category}
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          {/* Titre avec police spécifique */}
          <h3 className={`text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 ${playfairDisplay.className}`}>
            {title}
          </h3>
          {/* Description courte (si fournie) */}
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">{description}</p>
          )}
          {/* Informations : Difficulté et Temps Total */}
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
            {difficulty && (
              <span className="flex items-center">
                <BarChart className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                <span className="hidden sm:inline">{difficulty}</span>
                <span className="sm:hidden">{difficulty.charAt(0)}</span>
              </span>
            )}
            {totalTime > 0 && (
              <span className="flex items-center">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                {totalTime} min
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};