'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast"; // Assumant l'existence d'un hook de toast
import { Pencil, Trash } from "lucide-react";
// Importer le type RecipeWithStepCount depuis le fichier de données
import type { RecipeWithStepCount } from '@/lib/data/recipes';

interface RecipesTableProps {
  recipes: RecipeWithStepCount[]; // Utiliser le type spécifique
}

export default function RecipesTable({ recipes }: RecipesTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Pour suivre l'ID de l'élément en cours de suppression

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('La suppression a échoué');
      }

      toast({
        title: "Succès",
        description: "La recette a été supprimée.",
      });
      router.refresh(); // Rafraîchir les données côté serveur
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recette.",
        // variant: "destructive", // Retiré car non supporté par le type Toast actuel
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>{/* No extra whitespace */}
            <TableHead>Nom de la recette</TableHead>
            <TableHead>Date d’ajout</TableHead>
            <TableHead className="text-center">Nombre d’étapes</TableHead>{/* Placeholder */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>{/* No extra whitespace */}
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe.id}>{/* No extra whitespace */}
              <TableCell className="font-medium">{recipe.title}</TableCell>
              <TableCell>{new Date(recipe.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                {/* Utiliser le comptage fourni par Prisma */}
                <Badge variant="secondary">{recipe._count.steps}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/recipes/${recipe.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isDeleting === recipe.id}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible et supprimera définitivement la recette.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting === recipe.id}>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(recipe.id)}
                        disabled={isDeleting === recipe.id}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting === recipe.id ? 'Suppression...' : 'Supprimer'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}