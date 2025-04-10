// Retirer 'use client' pour en faire un Server Component

import { CreationForm } from '@/components/admin/CreationForm';
import { getCreationById } from '@/lib/data/creations'; // Utiliser le nom correct de la fonction exportée
import { notFound } from 'next/navigation'; // Garder notFound
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Retirer useRouter et useToast, car ils sont utilisés côté client (dans CreationForm)

interface EditCreationPageProps {
  params: {
    id: string;
  };
}

// Rendre la fonction de page async
export default async function EditCreationPage({ params }: EditCreationPageProps) {
  const { id } = params;

  // Récupérer les données côté serveur
  // Utiliser le nom correct de la fonction
  const creation = await getCreationById(id); // Ajouter await car la fonction est async

  if (!creation) {
    notFound();
  }

  // Préparer les données initiales pour le formulaire
  // Mapper createdAt (qui est un objet Date) vers creationDate attendu par le formulaire
  const initialData = {
    title: creation.title,
    description: creation.description,
    imageUrl: creation.image, // Utiliser le champ 'image' retourné par Prisma
    creationDate: creation.createdAt, // Utiliser createdAt directement
  };

  // La logique de soumission (toast, redirection) doit être gérée
  // à l'intérieur du composant CreationForm (qui est 'use client')
  // et non plus ici dans le Server Component.
  // On supprime donc handleEditSubmit.

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Modifier la création</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/creations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
      {/* Passer les données initiales et le callback spécifique */}
      {/* Passer uniquement les données initiales. La logique de soumission est dans CreationForm */}
      <CreationForm initialData={initialData} creationId={id} />
    </div>
  );
}