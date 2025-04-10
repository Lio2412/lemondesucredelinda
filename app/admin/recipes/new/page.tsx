import { RecipeForm } from '@/components/admin/RecipeForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewRecipePage() {
  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" size="sm" asChild className="mb-4">
         <Link href="/admin/recipes">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Retour à la liste
         </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-8">Ajouter une nouvelle recette</h1>
      <RecipeForm />
    </div>
  );
}