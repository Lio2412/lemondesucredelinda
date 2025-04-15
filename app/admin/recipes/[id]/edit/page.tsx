import React from 'react';
import { notFound } from 'next/navigation';
import { getRecipeById } from '@/lib/data/recipes'; // Utiliser la fonction qui inclut les relations
import { RecipeForm, RecipeFormValues } from '@/components/admin/RecipeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ingredient, RecipeStep } from '@prisma/client'; // Importer les types Prisma

interface EditRecipePageProps {
  params: { id: string };
}

// Fonction pour transformer les données Prisma en valeurs de formulaire
const transformDataForForm = (
    recipeData: NonNullable<Awaited<ReturnType<typeof getRecipeById>>> // Type Recipe & { ingredients; steps }
): RecipeFormValues => {
  return {
    title: recipeData.title,
    description: recipeData.description ?? '',
    difficulty: recipeData.difficulty ?? '',
    prepTime: recipeData.prepTime ?? undefined,
    cookTime: recipeData.cookTime ?? undefined,
    basePortions: recipeData.basePortions,
    category: recipeData.category ?? '',
    image: recipeData.image ?? undefined,
    published: recipeData.published, // Ajout du statut publié
    // Transformer les objets Ingredient
    ingredients: recipeData.ingredients.map((ing: Ingredient) => ({
      name: ing.name,
      quantity: ing.quantity, // Prisma retourne un nombre, le formulaire attend un nombre
      unit: ing.unit,
    })),
    // Transformer les objets RecipeStep
    steps: recipeData.steps.map((step: RecipeStep) => ({
      description: step.description,
      duration: step.duration ?? undefined, // Prisma retourne Int?, le formulaire attend number | undefined
    })),
  };
};

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const id = params.id;

  // Récupérer les données complètes de la recette via getRecipeById
  const recipeData = await getRecipeById(id);

  // Si la recette n'est pas trouvée, afficher une page 404
  if (!recipeData) {
    notFound();
  }

  // Transformer les données pour le formulaire
  let initialFormValues: RecipeFormValues;
  try {
    initialFormValues = transformDataForForm(recipeData);
  } catch (error) {
    console.error("Erreur lors de la transformation des données recette:", error);
    return <div className="container mx-auto py-10 text-red-600">Erreur lors de la préparation des données du formulaire.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Modifier la recette : {recipeData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Passer les données initiales ET l'ID de la recette */}
          <RecipeForm initialData={initialFormValues} recipeId={id} />
        </CardContent>
      </Card>
    </div>
  );
}