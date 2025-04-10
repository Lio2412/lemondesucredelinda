import { CreationForm } from '@/components/admin/CreationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewCreationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ajouter une nouvelle création</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/creations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
      <CreationForm />
    </div>
  );
}