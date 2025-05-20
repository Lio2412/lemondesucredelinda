import { prisma } from '@/lib/prisma'; // Correction de l'import
import { Article } from '@prisma/client'; // Importer le type Article généré par Prisma

// Fonction pour récupérer tous les articles depuis Prisma
export const getAllArticles = async (): Promise<Pick<Article, 'id' | 'title' | 'slug' | 'image' | 'excerpt' | 'createdAt' | 'publishedAt' | 'content' | 'tags'>[]> => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          lte: new Date(), // Seulement les articles dont la date de publication est passée ou présente
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        excerpt: true,
        createdAt: true,
        publishedAt: true,
        content: true, // Ajout du champ content
        tags: true,    // Ajout du champ tags
      },
      orderBy: {
        publishedAt: 'desc', // Trier par date de publication descendante
      },
    });
    return articles;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    throw new Error("Impossible de récupérer les articles.");
  }
};

// Fonction pour récupérer un article par son slug depuis Prisma
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        publishedAt: {
          lte: new Date(), // S'assurer que l'article est publié
        },
      },
    });
    return article;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article avec le slug ${slug}:`, error);
    // Retourner null ou lancer une erreur spécifique selon la gestion souhaitée
    return null;
  }
};


// Les fonctions getArticleBySlug et getArticleById ne sont plus nécessaires ici
// car la page admin n'en a pas besoin et les pages publiques
// récupèrent les données directement ou via d'autres mécanismes.
// Les données mockées sont également supprimées.