'use client';

import { useState } from 'react'; // Importer useState
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importer useRouter
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Importer AlertDialog
import { useToast } from '@/hooks/use-toast'; // Restaurer chemin original
import { formatDate } from '@/lib/utils';
import type { Creation } from '@prisma/client';
interface CreationsTableProps {
  creations: Creation[];
}

export default function CreationsTable({ creations }: CreationsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/creations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('La suppression a échoué');
      }

      toast({
        title: "Succès",
        description: "La création a été supprimée.",
      });
      router.refresh(); // Rafraîchir les données côté serveur
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la création.",
        // variant: "destructive", // Si supporté par votre hook toast
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Titre</TableHead>
            {/* Masquer sur < sm */}
            <TableHead className="w-[150px] hidden sm:table-cell">Date</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creations.map((creation) => (
            <TableRow key={creation.id}>
              <TableCell>
                <Image
                  src={creation.image || '/images/default-recipe.jpg'}
                  alt={creation.title}
                  width={50}
                  height={50}
                  className="rounded object-cover aspect-square"
                />
              </TableCell>
              <TableCell className="font-medium">{creation.title}</TableCell>
              {/* Masquer sur < sm */}
              <TableCell className="hidden sm:table-cell">{formatDate(creation.createdAt)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/creations/${creation.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isDeleting === creation.id}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible et supprimera définitivement la création "{creation.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting === creation.id}>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(creation.id)}
                        disabled={isDeleting === creation.id}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting === creation.id ? 'Suppression...' : 'Supprimer'}
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