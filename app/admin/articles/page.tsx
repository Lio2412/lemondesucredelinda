import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
// Importer le composant client
import ArticlesTable from '@/components/admin/ArticlesTable';
// import ArticlesTable from '@/components/admin/ArticlesTable';

// Structure de données pour un article (sera supprimée, on utilisera le type Prisma)
// Suppression du type local et des données mockées

export default async function AdminArticlesPage() { // Rendre async
  // Récupérer les articles depuis la base de données
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    // Inclure d'autres champs si nécessaire (ex: categories, tags si ce sont des relations)
    // select: { id: true, title: true, slug: true, createdAt: true, categories: true, tags: true } // Adapter selon le modèle
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
          <ArrowLeft size={16} />
          Retour au Dashboard
        </Link>
        <Button asChild>
          <Link href="/admin/articles/new">
            <FileText className="mr-2 h-4 w-4" /> Ajouter un article
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Gestion des articles</h1>

      {/* Rendre le tableau avec les données récupérées */}
      <ArticlesTable articles={articles} />
    </div>
  );
}