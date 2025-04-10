'use client'; // Ajouter la directive client

import Image from 'next/image';
import Link from 'next/link'; // Importer Link
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Creation } from '@prisma/client'; // Utiliser le type Prisma
import { motion } from 'framer-motion';

interface CreationCardProps {
  creation: Creation; // Utiliser le type importé
}

const CreationCard = ({ creation }: CreationCardProps) => {
  // Utiliser les champs corrects du type Creation: id, createdAt
  // Utiliser 'image' comme défini dans le schéma Prisma
  const { id, title, image, createdAt, description } = creation;

  // Note: L'utilisation de motion(Card) est dépréciée et cause des erreurs.
  // Nous allons envelopper la Card dans un motion.div à la place.

  return (
    // Commentaire supprimé pour éliminer toute interférence potentielle avec le parseur JSX
    <Link href={`/creations/${id}`} className="block h-full group">
      {/* Envelopper la Card dans motion.div pour l'animation */}
      <motion.div
        className="h-full" // Assurer que le div prend toute la hauteur
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden shadow-md flex flex-col h-full transition-shadow duration-300 group-hover:shadow-lg"> {/* Appliquer shadow au survol du groupe (Link) */}
      <CardHeader className="p-0">
        <div className="aspect-video relative w-full overflow-hidden"> {/* Ratio 16:9 pour l'image */}
          <Image
            // Utiliser un placeholder si l'image est null OU si c'est une URL mockée
            // Utiliser default-recipe.jpg comme placeholder
            src={image && !image.startsWith('/images/uploads/mock/') ? image : '/images/default-recipe.jpg'}
            alt={`Image de ${title}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // L'effet de zoom sur l'image est déjà géré par le scale de la carte parente, on peut simplifier
            className="transition-transform duration-500 ease-in-out"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow"> {/* flex-grow pour pousser le contenu vers le bas si nécessaire */}
        <CardTitle className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors duration-300">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3">
          {/* Utiliser createdAt pour le formatage */}
          {formatDate(createdAt)}
        </p>
        {description && ( // Afficher la description seulement si elle existe
          <p className="text-sm text-gray-700 line-clamp-3 flex-grow"> {/* line-clamp pour limiter la description */}
            {description}
          </p>
        )}
      </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default CreationCard;