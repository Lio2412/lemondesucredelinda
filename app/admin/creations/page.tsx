// Rendre la page serveur pour récupérer les données
// 'use client'; // Supprimé

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllCreations } from '@/lib/data/creations';
import CreationsTable from '@/components/admin/CreationsTable'; // Importer le nouveau composant client

export default async function AdminCreationsPage() { // Rendre async
  // Récupérer les données depuis la base de données
  const creations = await getAllCreations();
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des créations</h1>
        <Button asChild>
          <Link href="/admin/creations/new">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une création {/* Utiliser Plus */}
          </Link>
        </Button>
      </div>

      {/* Utiliser le composant client pour afficher le tableau */}
      <CreationsTable creations={creations} />
       {/* TODO: Ajouter la pagination si nécessaire */}
    </div>
  );
}