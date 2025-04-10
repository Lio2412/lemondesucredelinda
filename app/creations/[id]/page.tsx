// IMPORTANT: Ce fichier doit être dans un dossier nommé [id], pas [slug]

import { getCreationById, getAllCreations } from '@/lib/data/creations'; // Importer les fonctions Prisma
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedTitle from '@/components/creations/AnimatedTitle';
import CreationCard from '@/components/creations/CreationCard';
import { Metadata } from 'next';
// Corriger l'import du type Creation
import type { PrismaClient } from '@prisma/client'; 

// Définir notre propre type en se basant sur les retours des fonctions
interface Creation {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date; // Ajouter cette propriété manquante
}

interface CreationPageProps {
  params: {
    id: string; // Utiliser id
  };
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: CreationPageProps): Promise<Metadata> {
  try {
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
  } catch (error) {
    console.error("Erreur lors de la génération des métadonnées:", error);
    // En cas d'erreur, retourner des métadonnées par défaut
    return {
      title: "Création | Le Monde Sucré de Linda",
      description: "Découvrez mes créations pâtissières."
    };
  }
}

// Fonction pour générer les chemins statiques au moment du build
export async function generateStaticParams() {
  try {
    const creations = await getAllCreations(); // Récupérer toutes les créations
    return creations.map((creation) => ({
      id: creation.id, // Utiliser l'ID
    }));
  } catch (error) {
    console.error("Erreur lors de la génération des paramètres statiques:", error);
    // En cas d'erreur, retourne un tableau vide pour éviter l'échec du build
    return [];
  }
}

export default async function CreationPage({ params }: CreationPageProps) { // Rendre async
  try {
    const { id } = params; // Utiliser id
    
    // Tenter de récupérer la création
    const creation = await getCreationById(id);

    // Si la création n'est pas trouvée, afficher une page 404
    if (!creation) {
      notFound();
    }

    // Utiliser les champs corrects: image, createdAt
    const { title, image, createdAt, description } = creation;

    // Récupérer les créations similaires
    let similarCreations: Creation[] = [];
    try {
      // Essayer de récupérer toutes les créations pour les similaires
      const allCreations = await getAllCreations();
      
      // Filtrer pour obtenir 3 créations similaires (différentes de l'actuelle par ID)
      similarCreations = allCreations
        .filter((c) => c.id !== id)
        .slice(0, 3);
    } catch (error) {
      console.error("Erreur lors de la récupération des créations similaires:", error);
      // En cas d'erreur, laisser similarCreations comme un tableau vide
    }

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
            "La gourmandise commence là où la raison s'arrête."
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
  } catch (error) {
    // Gestion d'erreur générale pour la page entière
    console.error("Erreur lors du rendu de la page de création:", error);
    
    // Afficher une page d'erreur personnalisée
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32 text-center">
        <h1 className="text-3xl font-bold mb-6">Une erreur est survenue</h1>
        <p className="mb-8">Impossible de charger cette création. Veuillez réessayer plus tard.</p>
        <Link href="/creations" className="text-pink-600 hover:underline">
          Retour à la liste des créations
        </Link>
      </div>
    );
  }
}