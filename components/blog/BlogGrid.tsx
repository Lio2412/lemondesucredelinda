'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import type { Article } from '@prisma/client'; // Importer le type Article de Prisma

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Définir un type plus précis pour les articles attendus par ce composant
// Basé sur les champs sélectionnés dans la page serveur
// Assurer que les champs correspondent à ceux réellement utilisés et disponibles
type ArticleForGrid = Pick<
  Article,
  | 'id'
  | 'slug'
  | 'title'
  | 'createdAt'
  | 'tags'
  | 'content'
  | 'image' // 'image' est String? dans le schéma
>;

interface BlogGridProps {
  articles: ArticleForGrid[];
}

const pageSize = 6; // Nombre d'articles par page

export default function BlogGrid({ articles }: BlogGridProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');

  // Extraire tous les tags uniques des articles pour les filtres
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [articles]);

  // Filtrer et paginer les articles
  const paginatedArticles = useMemo(() => {
    const filtered = articles.filter(article => {
      const tagMatch = selectedTag === '' || (article.tags && article.tags.includes(selectedTag));
      const searchMatch = search === '' ||
                          article.title.toLowerCase().includes(search.toLowerCase()) ||
                          (article.content && article.content.toLowerCase().includes(search.toLowerCase()));
      return tagMatch && searchMatch;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: filtered.slice(startIndex, endIndex),
      meta: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: filtered.length,
      }
    };
  }, [search, selectedTag, page, articles]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTagChange = (newTag: string) => {
    setSelectedTag(newTag);
    setPage(1);
  };

  // Fonction pour générer un résumé simple à partir du contenu
  const generateSummary = (content: string | null, maxLength = 150): string => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    // Trouve le dernier espace avant la limite pour couper proprement
    const lastSpace = content.lastIndexOf(' ', maxLength);
    return content.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
  };


  return (
    <>
      {/* Barre de recherche */}
      <div className="flex justify-center mb-10">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <Input
            type="text"
            placeholder="Rechercher des articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-gray-300 dark:border-gray-600 pr-12 py-2 dark:bg-gray-800 dark:text-white focus:border-pink-500 dark:focus:border-pink-400 focus:ring-pink-500/20"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-gray-500 hover:text-pink-600 dark:hover:text-pink-400"
          >
            <Search className="w-4 h-4" />
            <span className="sr-only">Rechercher</span>
          </Button>
        </form>
      </div>

      {/* Filtres par tag */}
      <div className="flex justify-center flex-wrap gap-2 mb-12">
        <Button
          variant="outline"
          onClick={() => handleTagChange('')}
          className={`rounded-full transition-colors ${selectedTag === '' ? 'bg-pink-600 text-white hover:bg-pink-700 border-pink-600' : 'dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
        >
          Tous
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            onClick={() => handleTagChange(tag)}
            className={`rounded-full transition-colors ${selectedTag === tag ? 'bg-pink-600 text-white hover:bg-pink-700 border-pink-600' : 'dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Grille des articles */}
      {paginatedArticles.data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 dark:text-gray-400">Aucun article trouvé.</p>
          {(search || selectedTag) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                handleTagChange('');
              }}
              className="mt-4 rounded-full dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.data.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="group block">
                {/* Utiliser le slug pour le lien (commentaire déplacé) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border dark:border-gray-700">
                  {/* Vérifier explicitement que article.image est une string non vide */}
                  {typeof article.image === 'string' && article.image.length > 0 && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={article.image} // Maintenant on est sûr que c'est une string
                        alt={article.title ?? 'Image article'} // Ajouter un fallback pour alt
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2 flex flex-wrap gap-1">
                      {/* Afficher les tags */}
                      {article.tags?.map((tag) => (
                         <Badge key={tag} variant="secondary" className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-medium">{tag}</Badge>
                      ))}
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 ${playfairDisplay.className}`}>
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                      {generateSummary(article.content)}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      {/* Auteur n'est pas dans le modèle Prisma Article */}
                      {/* <span>Par Linda</span> */}
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {paginatedArticles.meta.totalPages > 1 && (
             <div className="flex justify-center mt-12">
               <div className="flex items-center space-x-2">
                 <Button
                   variant="outline"
                   onClick={() => setPage(page - 1)}
                   disabled={page === 1}
                   className="rounded-md dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                 >
                   Précédent
                 </Button>
                 {/* Génération des numéros de page (simplifié pour l'exemple) */}
                 {[...Array(paginatedArticles.meta.totalPages)].map((_, i) => (
                   <Button
                     key={i + 1}
                     variant={i + 1 === page ? "default" : "outline"}
                     onClick={() => setPage(i + 1)}
                     className={`rounded-md w-9 h-9 p-0 ${i + 1 === page ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' : 'dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                   >
                     {i + 1}
                   </Button>
                 ))}
                 <Button
                   variant="outline"
                   onClick={() => setPage(page + 1)}
                   disabled={page === paginatedArticles.meta.totalPages}
                   className="rounded-md dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                 >
                   Suivant
                 </Button>
               </div>
             </div>
           )}
        </>
      )}
    </>
  );
}