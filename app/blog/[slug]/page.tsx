import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { formatDate } from '@/lib/utils';
import { getArticleBySlug } from '@/lib/data/articles'; // Importer la fonction de récupération réelle
import { Badge } from '@/components/ui/badge';
import { Playfair_Display } from 'next/font/google';
import { CalendarDays } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Importer ReactMarkdown
import remarkGfm from 'remark-gfm'; // Importer remark-gfm pour les extensions Markdown
import AnimatedArticleTitle from '@/components/blog/AnimatedArticleTitle'; // Importer le nouveau composant

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Props pour la page Server Component
interface BlogPostPageProps {
  params: { slug: string };
}

// Générer les métadonnées dynamiquement (optionnel mais recommandé pour le SEO)
export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article non trouvé - Le Monde Sucré de Linda',
      description: 'Désolé, cet article n\'a pas été trouvé.',
    };
  }

  const description = article.excerpt ?? article.content.substring(0, 160);
  // Assurer une URL absolue pour l'image (à adapter si nécessaire)
  const imageUrl = article.image ?? '/placeholder-image.jpg'; // Utiliser une image par défaut si null

  return {
    title: `${article.title} - Le Monde Sucré de Linda`,
    description: description,

    openGraph: {
      title: `${article.title} - Le Monde Sucré de Linda`,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        // ...((await parent).openGraph?.images || []), // Décommenter si on veut garder les images parentes
      ],
      // Optionnel: Décommenter et adapter si nécessaire
      // url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      // type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${article.title} - Le Monde Sucré de Linda`,
      description: description,
      images: [imageUrl], // Twitter utilise juste l'URL
    },
  };
}


// La page est maintenant un Server Component (async)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug); // Récupérer l'article réel

  // Si l'article n'est pas trouvé dans la base de données
  if (!article) {
    notFound(); // Déclenche la page not-found.tsx
  }


  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
       <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
         <article className="max-w-3xl mx-auto">
           {/* En-tête de l'article */}
           <header className="mb-8 md:mb-12">
             {/* Tags (remplace la catégorie) */}
             {article.tags && article.tags.length > 0 && (
               <div className="mb-4 flex flex-wrap gap-2">
                 {article.tags.map(tag => (
                   <Badge key={tag} variant="secondary" className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-medium">{tag}</Badge>
                 ))}
               </div>
             )}
             {/* Titre (utilisation du composant client) */}
             <AnimatedArticleTitle title={article.title} />
             {/* Métadonnées (Date de publication/création) */}
             <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
               {/* Auteur n'est pas dans le modèle, on l'enlève */}
               <div className="flex items-center gap-1.5">
                 <CalendarDays size={14} />
                 <time dateTime={article.publishedAt?.toISOString() ?? article.createdAt.toISOString()}>
                   {formatDate(article.publishedAt ?? article.createdAt)} {/* Afficher publishedAt si disponible, sinon createdAt */}
                 </time>
               </div>
             </div>
           </header>

           {/* Image de couverture */}
           {typeof article.image === 'string' && article.image.length > 0 && (
             <div className="relative w-full aspect-video mb-8 md:mb-12 rounded-lg overflow-hidden shadow-lg">
               <Image
                 src={article.image}
                 alt={article.title ?? 'Image article'}
                 fill
                 sizes="(max-width: 768px) 100vw, 800px"
                 className="object-cover"
                 priority
               />
             </div>
           )}

           {/* Extrait (si présent) */}
            {article.excerpt && (
             <p className="text-lg md:text-xl italic text-gray-600 dark:text-gray-400 border-l-4 border-pink-500 pl-4 py-2 mb-8 md:mb-12">
               {article.excerpt}
             </p>
           )}

           {/* Contenu de l'article */}
           {/* Appliquer les styles prose pour le formatage */}
           <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-strong:text-gray-800 dark:prose-strong:text-gray-200 prose-a:text-pink-600 dark:prose-a:text-pink-400 hover:prose-a:text-pink-700 dark:hover:prose-a:text-pink-300 prose-li:marker:text-pink-500">
             <ReactMarkdown
               remarkPlugins={[remarkGfm]}
             >
               {article.content}
             </ReactMarkdown>
           </div>
         </article>
       </div>
    </div>
  );
}