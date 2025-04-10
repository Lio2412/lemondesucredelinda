// Retirer 'use client' pour en faire un Server Component
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Importer notFound
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma'; // Importer Prisma
import { ArticleForm, ArticleFormValues } from '@/components/admin/ArticleForm'; // Importer aussi ArticleFormValues
// Retirer useParams, useRouter, useToast
// --- Copié depuis app/admin/articles/page.tsx ---
// Suppression du type local et des données mockées

interface EditArticlePageProps {
  params: { id: string };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) { // Rendre async et recevoir params
  const articleId = params.id;

  // Récupérer les données de l'article via Prisma
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    // Sélectionner les champs nécessaires pour le formulaire
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      // Ajouter les champs manquants
      slug: true,
      excerpt: true,
      image: true,
      publishedAt: true,
      createdAt: true, // Garder createdAt si besoin ailleurs, sinon publishedAt suffit peut-être
    }
  });

  // Si l'article n'est pas trouvé, afficher une page 404
  if (!article) {
    notFound();
  }

  // Préparer les données initiales pour le formulaire
  // Mapper les champs de l'article mock vers les champs attendus par ArticleFormValues
  // Transformer les données Prisma pour correspondre à ArticleFormValues
  const initialData: ArticleFormValues = {
    title: article.title,
    // Le formulaire attend un slug, mais il n'est pas dans Prisma. Mettre une valeur vide ou générer ?
    slug: article.slug, // Utiliser le slug récupéré
    // Transformer le tableau de tags en chaîne
    tags: article.tags.join(', '),
    // Utiliser l'excerpt récupéré (ou vide si null)
    excerpt: article.excerpt ?? '',
    content: article.content ?? '', // Utiliser le contenu de Prisma
    // Utiliser publishedAt si disponible, sinon createdAt (ou null/undefined si le formulaire le gère)
    // Si publishedAt peut être null, le DatePicker doit pouvoir le gérer.
    // S'il est obligatoire, createdAt est un fallback possible mais sémantiquement différent.
    // On utilise publishedAt directement, le formulaire devra gérer le cas null.
    publishedAt: article.publishedAt, // Utiliser la vraie date de publication
    // Utiliser l'image récupérée (ou vide si null)
    imageUrl: article.image ?? '',
  };

  // La logique de soumission (toast, redirection) sera gérée dans ArticleForm

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
          <ArrowLeft size={16} />
          Retour à la liste des articles
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Modifier l'article : {article.title}</h1>

      {/* Passer les données transformées et l'ID au formulaire */}
      {/* La prop onSubmitSuccess n'est plus nécessaire ici */}
      <ArticleForm
        initialData={initialData}
        articleId={article.id} // Passer l'ID pour le mode édition
      />
    </div>
  );
}