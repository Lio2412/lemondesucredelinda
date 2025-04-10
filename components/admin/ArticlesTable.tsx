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
import { useToast } from "@/hooks/use-toast"; // Restaurer chemin original
import { Pencil, Trash } from "lucide-react";
import type { Article } from '@prisma/client'; // Importer le type Article

interface ArticlesTableProps {
  articles: Article[]; // Adapter le type si Article a des relations à inclure
}

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('La suppression a échoué');
      }

      toast({
        title: "Succès",
        description: "L'article a été supprimé.",
      });
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        // variant: "destructive",
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
            <TableHead>Titre</TableHead>
            {/* <TableHead className="hidden md:table-cell">Slug</TableHead> Retiré */}
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead>Tags</TableHead>{/* Mise à jour du titre */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>{/* No extra whitespace */}
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>{/* No extra whitespace */}
              <TableCell className="font-medium">{article.title}</TableCell>
              {/* <TableCell className="hidden md:table-cell text-muted-foreground">{article.slug}</TableCell> Retiré */}
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {new Date(article.createdAt).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {article.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link href={`/admin/articles/${article.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isDeleting === article.id}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible et supprimera définitivement l'article "{article.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting === article.id}>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting === article.id}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting === article.id ? 'Suppression...' : 'Supprimer'}
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