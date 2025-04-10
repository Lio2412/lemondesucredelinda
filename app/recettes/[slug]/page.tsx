import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { Clock, BarChart, Users, Soup, ListOrdered, ChefHat } from 'lucide-react'; // Réimporter ChefHat
import { Playfair_Display } from 'next/font/google';
import { getRecipeBySlug } from '@/lib/data/recipes'; // Utiliser getRecipeBySlug
import { Recipe, Ingredient, RecipeStep } from '@prisma/client'; // Importer les types Prisma
import { Button } from '@/components/ui/button';
import { CookingModeWrapper } from '@/components/recipe/CookingModeWrapper'; // Importer le wrapper client

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Interface pour les props de la page, incluant les relations chargées
interface RecipePageProps {
  params: { slug: string };
}


// Type pour les props de generateMetadata
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: 'Recette introuvable - Le Monde Sucré de Linda',
      description: 'Désolé, cette recette n\'a pas été trouvée.', // Échapper l'apostrophe
      // Autres métadonnées par défaut si nécessaire
    };
  }

  // Assurez-vous que recipe.image est une URL absolue
  // Si ce n'est pas le cas, construisez l'URL ici. Exemple :
  // const imageUrl = recipe.image ? `${process.env.NEXT_PUBLIC_BASE_URL}${recipe.image}` : '/default-image.jpg';
  // Pour l'instant, on suppose que recipe.image est déjà absolue.
  const imageUrl = recipe.image ?? '/placeholder-image.jpg'; // Utiliser une image par défaut si null

  return {
    title: `${recipe.title} - Le Monde Sucré de Linda`,
    description: recipe.description ?? 'Découvrez cette délicieuse recette.', // Utiliser une description par défaut si null

    openGraph: {
      title: `${recipe.title} - Le Monde Sucré de Linda`,
      description: recipe.description ?? 'Découvrez cette délicieuse recette.',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
      // Optionnel: Décommenter et adapter si nécessaire
      // url: `${process.env.NEXT_PUBLIC_BASE_URL}/recettes/${slug}`,
      // type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Le Monde Sucré de Linda`,
      description: recipe.description ?? 'Découvrez cette délicieuse recette.',
      images: [imageUrl],
    },
  };
}

// Le composant est un Server Component (async)
export default async function RecettePage({ params }: RecipePageProps) {
  const { slug } = params;

  // Récupérer la recette par slug, incluant ingrédients et étapes
  const recipe = await getRecipeBySlug(slug);

  // Si la recette n'est pas trouvée, afficher la page 404
  if (!recipe) {
    notFound();
  }

  // Calculer le temps total si les temps sont définis
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  // Préparer les données pour CookingMode (ajouter un id simple si nécessaire pour le client)
  const cookingModeSteps = recipe.steps.map(step => ({
      id: step.id, // Utiliser l'ID Prisma
      description: step.description,
      duration: step.duration ?? undefined, // Utiliser la durée de Prisma
      // ingredientsUsed: step.ingredientsUsed ?? [], // Ce champ n'existe pas dans notre modèle actuel
  }));

  const cookingModeIngredients = recipe.ingredients.map(ing => ({
      id: ing.id, // Utiliser l'ID Prisma
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
  }));


  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16">

        {/* === Section En-tête Recette === */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Colonne Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">Image non disponible</span>
                </div>
              )}
            </div>

            {/* Colonne Informations */}
            <div className="flex flex-col justify-center">
              {/* Catégorie */}
              {recipe.category && (
                <span className="text-sm text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-2">{recipe.category}</span>
              )}
              {/* Titre */}
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${playfairDisplay.className}`}>
                {recipe.title}
              </h1>
              {/* Description */}
              {recipe.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{recipe.description}</p>
              )}
              {/* Icônes d'information */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700 dark:text-gray-300 mb-8">
                 {recipe.difficulty && (
                   <span className="flex items-center"><BarChart className="w-4 h-4 mr-1.5 text-pink-500" /> {recipe.difficulty}</span>
                 )}
                 {totalTime > 0 && (
                   <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-pink-500" /> {totalTime} min</span>
                 )}
                 {/* Utilisation de basePortions */}
                 <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-pink-500" /> {recipe.basePortions} portions</span>
              </div>
              {/* Bouton Mode Cuisine (Wrapper Client) */}
              <CookingModeWrapper
                 recipeTitle={recipe.title}
                 steps={cookingModeSteps}
                 ingredients={cookingModeIngredients}
                 basePortions={recipe.basePortions}
              >
                 <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white self-start">
                   <ChefHat className="w-5 h-5 mr-2" />
                   Passer en Mode Cuisine
                 </Button>
              </CookingModeWrapper>
            </div>
          </div>
        </section>

        {/* === Section Contenu Recette === */}
        <section className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Colonne Ingrédients */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Soup className="w-6 h-6 mr-2 text-pink-600 dark:text-pink-400" />
              Ingrédients
            </h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                {/* Affichage structuré */}
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                     <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Aucun ingrédient spécifié.</p>
            )}
          </div>

          {/* Colonne Étapes */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <ListOrdered className="w-6 h-6 mr-2 text-pink-600 dark:text-pink-400" />
              Préparation
            </h2>
            {recipe.steps && recipe.steps.length > 0 ? (
              <ol className="space-y-6">
                {/* Affichage structuré */}
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full font-bold mr-4">{step.order}</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                    {/* Afficher la durée si elle existe */}
                    {/* {step.duration && <span className="text-xs text-gray-500 ml-2">({step.duration} min)</span>} */}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 italic">Aucune étape spécifiée.</p>
            )}
          </div>
        </section>

      </div>
      {/* Le CookingMode est maintenant géré par CookingModeWrapper */}
    </main>
  );
}