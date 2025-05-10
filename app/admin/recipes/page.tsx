export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import Link from "next/link";
// Importer la fonction qui récupère les données avec le compte
import { getAllRecipes } from "@/lib/data/recipes";
// Importer le composant client pour le tableau
import RecipesTable from "@/components/admin/RecipesTable";

// Mock data for recipes - Sera supprimé
// Suppression des données mockées

export default async function AdminRecipesPage() {
  // Récupérer les recettes via la fonction dédiée
  const recipes = await getAllRecipes({ includeUnpublished: true }); // Afficher toutes les recettes (publiées ou non)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <ChefHat className="mr-2 h-8 w-8" /> Gestion des Recettes
        </h1>
        {/* TODO: Link this button to the recipe creation page/modal */}
        <Button asChild>
          <Link href="/admin/recipes/new">➕ Ajouter une recette</Link>
        </Button>
      </div>

      {/* Rendre le tableau avec les données récupérées */}
      <RecipesTable recipes={recipes} />
    </div>
  );
}