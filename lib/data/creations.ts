// Importer l'instance Prisma partagée
import { prisma } from '@/lib/prisma';
// Importer le type Creation depuis Prisma Client généré pour assurer la cohérence
// Ou continuer à utiliser le type de '@/types' s'il est garanti identique
import type { Creation } from '@prisma/client'; // Utiliser le type Prisma

// Les données mockées ne sont plus nécessaires ici


// Fonction pour récupérer toutes les créations depuis la BDD
export const getAllCreations = async (): Promise<Creation[]> => {
  try {
    // Ajouter un log pour debug
    console.log("Tentative de connexion à la base de données avec l'URL:", 
      process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.substring(0, 20)}...` : // Masquer les détails sensibles
      "DATABASE_URL non définie");
    
    const creations = await prisma.creation.findMany({
      orderBy: {
        createdAt: 'desc', // Optionnel: trier par défaut
      },
      // Supprimer cacheStrategy car Accelerate est désactivé
      // cacheStrategy: { ttl: 0 }
    });
    
    console.log(`Récupération réussie de ${creations.length} créations`);
    
    // Le type retourné par Prisma devrait correspondre à notre type Creation
    // S'il y a des différences (ex: imageUrl vs image), il faudrait mapper ici.
    // Dans ce cas, les types semblent correspondre (en utilisant le type Prisma).
    return creations;
  } catch (error) {
    // Logguer l'erreur spécifique avant de lancer l'erreur générique
    console.error("Erreur spécifique lors de la récupération des créations:", error);
    
    // Ajouter plus de détails pour le debug
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
      
      // Vérifier si c'est une erreur Prisma
      if ('code' in error) {
        console.error("Code d'erreur Prisma:", (error as any).code);
      }
      
      // Vérifier si c'est une erreur de connexion
      if (error.message.includes("Can't reach database server")) {
        console.error("Erreur de connexion à la base de données. Vérifiez DATABASE_URL et les restrictions réseau.");
      }
    }
    
    throw new Error("Impossible de récupérer les créations."); // Propager l'erreur générique
  }
};


// Fonction pour récupérer les N dernières créations depuis la BDD
export const getLastCreations = async (count: number = 5): Promise<Creation[]> => {
   try {
    const creations = await prisma.creation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: count,
    });
    return creations;
  } catch (error) {
    console.error(`Erreur lors de la récupération des ${count} dernières créations:`, error);
    throw new Error("Impossible de récupérer les dernières créations.");
  }
};

// Fonction pour récupérer une création par son ID depuis la BDD
export const getCreationById = async (id: string): Promise<Creation | null> => {
  try {
    const creation = await prisma.creation.findUnique({
      where: { id },
    });
    return creation; // Retourne la création ou null si non trouvée
  } catch (error) {
    console.error(`Erreur lors de la récupération de la création ${id}:`, error);
    throw new Error("Impossible de récupérer la création.");
  }
};

// La fonction slugify n'est plus nécessaire car le modèle Creation n'a pas de slug


// Fonction pour ajouter une création à la BDD
// Le type data correspond aux champs nécessaires pour créer une nouvelle entrée
// Note: Prisma gère id, createdAt, updatedAt automatiquement
export const addCreation = async (data: { title: string; description?: string; image?: string }): Promise<Creation> => {
  try {
    const newCreation = await prisma.creation.create({
      data: {
        title: data.title,
        description: data.description || '', // Assurer une valeur par défaut
        image: data.image, // Peut être null/undefined si optionnel
      },
    });
    return newCreation;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la création:", error);
    throw new Error("Impossible d'ajouter la création.");
  }
};

// TODO: Ajouter les fonctions updateCreation et deleteCreation si nécessaire