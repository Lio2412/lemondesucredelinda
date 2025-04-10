// IMPORTANT: Ce fichier doit être dans un dossier nommé [id], pas [slug]

import { getCreationById, getAllCreations } from '@/lib/data/creations'; // Importer les fonctions Prisma
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedTitle from '@/components/creations/AnimatedTitle';
import CreationCard from '@/components/creations/CreationCard';
import { Metadata } from 'next';
import type { Creation } from '@prisma/client'; // Utiliser le type Prisma

interface CreationPageProps {
  params: {
    id: string; // Utiliser id
  };
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: CreationPageProps): Promise<Metadata> {
  const creation = await getCreationById(params.id); // Utiliser l'ID

  if (!creation) {
    return {
      title: 'Création non trouvée',
    };
  }

  return {
    title: `${creation.title} | Mes Créations Pâtissières`,
    description: creation.description || `Découvrez ma création : ${creation.title}`,
    // Ajouter l'URL de l'image aux métadonnées Open Graph si disponible
    openGraph: creation.image ? {
      images: [{ url: creation.image }],
    } : undefined,
  };
}

// Fonction pour générer les chemins statiques au moment du build
// MODIFIÉ: Retourne un tableau vide pour éviter l'erreur de connexion à la base de données pendant le build
// Les pages seront générées à la demande, en mode dynamique
export async function generateStaticParams() {
  // Contourner l'accès à la base de données pendant le build
  console.log("Contournement de l'accès à la base de données pendant le build");
  return [];
  
  // Code original commenté:
  // try {
  //   const creations = await getAllCreations(); // Récupérer toutes les créations
  //   return creations.map((creation) => ({
  //     id: creation.id, // Utiliser l'ID
  //   }));
  // } catch (error) {
  //   console.error("Erreur lors de la génération des paramètres statiques:", error);
  //   return []; // Retourne un tableau vide en cas d'erreur
  // }
}

export default async function CreationPage({ params }: CreationPageProps) { // Rendre async
  const { id } = params; // Utiliser id
  const creation = await getCreationById(id); // Utiliser id

  if (!creation) {
    notFound(); // Redirige vers la page 404 si la création n'est pas trouvée
  }

  // Utiliser les champs corrects: image, createdAt
  const { title, image, createdAt, description } = creation;

  // Récupérer toutes les créations pour trouver des similaires
  const allCreations = await getAllCreations();

  // Filtrer pour obtenir 3 créations similaires (différentes de l'actuelle par ID)
  const similarCreations = allCreations
    .filter((c) => c.id !== id) // Filtrer par ID
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
      <article className="max-w-3xl mx-auto">
        {image && ( // Afficher l'image seulement si elle existe
          <div className="w-full h-[300px] md:h-[400px] rounded-xl shadow-lg overflow-hidden mb-8 md:mb-12 relative">
            <Image
              src={image} // Utiliser 'image'
              alt={`Image de ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="text-center px-4">
          <AnimatedTitle title={title} />
          <p className="text-sm text-muted-foreground mb-8 md:mb-10">
            Publié le {formatDate(createdAt)} {/* Utiliser createdAt */}
          </p>
        </div>

        {description && (
          <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto mt-6 px-4">
            <p>{description}</p>
          </div>
        )}

        <blockquote className="italic text-center mt-10 text-muted-foreground px-4">
          “La gourmandise commence là où la raison s’arrête.”
        </blockquote>

        <div className="text-center mt-12">
          <Link href="/creations" className="text-sm text-pink-600 hover:underline">
            &larr; Retour aux créations
          </Link>
        </div>
      </article>

      {/* Section "Autres créations similaires" */}
      {similarCreations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
            Autres créations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCreations.map((similarCreation) => (
              // Utiliser l'ID comme clé
              <CreationCard key={similarCreation.id} creation={similarCreation} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}