import { prisma } from '@/lib/prisma'; // Correction de l'import
import { Article } from '@prisma/client'; // Importer le type Article généré par Prisma

// Fonction pour récupérer tous les articles depuis Prisma
export const getAllArticles = async (): Promise<Pick<Article, 'id' | 'title' | 'createdAt'>[]> => {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc', // Optionnel ici, car le tri final se fait dans la page admin
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
    // Utiliser findFirst qui est plus flexible pour les champs non-ID uniques
    const article = await prisma.article.findFirst({
      where: {
        slug: slug, // Chercher par le champ slug
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