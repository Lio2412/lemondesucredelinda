import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleForm } from '@/components/admin/ArticleForm'; // Importer le composant de formulaire

export default function NewArticlePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
          <ArrowLeft size={16} />
          Retour à la liste des articles
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Ajouter un nouvel article</h1>
      <ArticleForm /> {/* Utiliser le composant de formulaire ici */}
    </div>
  );
}