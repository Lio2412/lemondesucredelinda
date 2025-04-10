import { prisma } from '@/lib/prisma';

/**
 * Récupère les comptes totaux pour les recettes, créations et articles.
 */
export async function getTotalCounts() {
  const [recipeCount, creationCount, articleCount] = await Promise.all([
    prisma.recipe.count(),
    prisma.creation.count(),
    prisma.article.count(),
  ]);

  return {
    recipes: recipeCount,
    creations: creationCount,
    articles: articleCount,
  };
}


/**
 * Récupère les 5 derniers contenus (recettes, créations, articles) ajoutés.
 */
export async function getRecentContents() {
  const [recipes, creations, articles] = await Promise.all([
    prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.creation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  const allContent = [
    ...recipes.map((r) => ({ ...r, type: 'recipe' as const })),
    ...creations.map((c) => ({ ...c, type: 'creation' as const })),
    ...articles.map((a) => ({ ...a, type: 'article' as const })),
  ];

  // Trier tous les contenus récupérés par date de création et prendre les 5 plus récents
  const sortedContent = allContent
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
  return sortedContent;
}

/**
 * Récupère les données de contenu regroupées par mois pour le graphique.
 */
export async function getMonthlyContentData() {
  const [recipes, creations, articles] = await Promise.all([
    prisma.recipe.findMany({ select: { createdAt: true } }),
    prisma.creation.findMany({ select: { createdAt: true } }),
    prisma.article.findMany({ select: { createdAt: true } }),
  ]);

  const monthlyData: { [key: string]: { month: string; recipes: number; creations: number; articles: number } } = {};

  const processContent = (
    items: { createdAt: Date }[],
    type: 'recipes' | 'creations' | 'articles'
  ) => {
    items.forEach((item) => {
      const monthYear = item.createdAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
      }).replace('.', ''); // Supprimer le point après le mois abrégé
      // Initialise le mois s'il n'existe pas
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, recipes: 0, creations: 0, articles: 0 };
      }
      // Incrémente le compteur pour le type de contenu
      monthlyData[monthYear][type]++;
    });
  };

  processContent(recipes, 'recipes');
  processContent(creations, 'creations');
  processContent(articles, 'articles');

  // Convertir l'objet en tableau et trier par date
  const sortedData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(parseInt(a.month.split(' ')[1]), getMonthIndex(a.month.split(' ')[0]));
    const dateB = new Date(parseInt(b.month.split(' ')[1]), getMonthIndex(b.month.split(' ')[0]));
    return dateA.getTime() - dateB.getTime();
  });

  return sortedData;
}

// Helper pour obtenir l'index du mois pour le tri
function getMonthIndex(monthAbbr: string): number {
  const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  return months.indexOf(monthAbbr.toLowerCase());
}

