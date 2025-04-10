import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Importer bcryptjs

// Définir les données mockées directement dans le script de seed
// Type pour les données brutes
type MockCreationRaw = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string; // Utiliser imageUrl comme dans les données originales
  createdAt: string; // Dates en string ISO
  updatedAt: string;
};

const mockCreationsData: MockCreationRaw[] = [
  {
    id: "1",
    title: "Tarte aux fraises",
    imageUrl: "/images/recipes/tarte-citron-meringuee.jpg",
    createdAt: "2025-03-28T10:00:00Z",
    updatedAt: "2025-03-28T10:00:00Z",
    description: "Une tarte croustillante garnie de crème pâtissière et de fraises fraîches.",
  },
  {
    id: "2",
    title: "Macarons au chocolat",
    imageUrl: "/images/recipes/macarons-vanille.jpg",
    createdAt: "2025-04-15T14:30:00Z",
    updatedAt: "2025-04-15T14:30:00Z",
    description: "Des coques délicates et une ganache riche en chocolat.",
  },
  {
    id: "3",
    title: "Éclairs au café",
    imageUrl: "/images/recipes/eclair-cafe.jpg",
    createdAt: "2025-04-02T09:15:00Z",
    updatedAt: "2025-04-02T09:15:00Z",
    description: "Pâte à choux légère garnie d'une crème au café onctueuse.",
  },
  {
    id: "4",
    title: "Forêt Noire revisitée",
    imageUrl: "/images/recipes/gateau-chocolat.jpg",
    createdAt: "2025-03-10T18:00:00Z",
    updatedAt: "2025-03-10T18:00:00Z",
    description: "Un classique allemand avec une touche moderne.",
  },
];

// Importer les données mockées pour les recettes et articles si nécessaire
// import { mockRecipesData } from '../lib/data/recipes'; // Ajuster le chemin si nécessaire
// import { mockArticlesData } from '../lib/data/articles';

const prisma = new PrismaClient();

async function main() {
  console.log(`Début du seeding...`);

  // --- Seed Créations ---
  console.log('Seeding Créations...');
  for (const creationData of mockCreationsData) { // Utiliser les données locales
    // Les données mockées ont déjà createdAt/updatedAt en string ISO
    // Prisma s'attend à des objets Date ou des strings ISO valides
    const creation = await prisma.creation.upsert({
      where: { id: creationData.id }, // Utiliser un champ unique pour éviter les doublons si le seed est relancé
      update: {
        title: creationData.title,
        description: creationData.description || '', // Assurer une valeur par défaut si description est vide
        image: creationData.imageUrl, // Utiliser 'image' (Prisma) avec 'imageUrl' (données mock)
        // Prisma gère la conversion string ISO -> DateTime
        createdAt: creationData.createdAt,
        updatedAt: creationData.updatedAt,
        // category: creationData.category, // Ajouter si le modèle et les mocks ont une catégorie
      },
      create: {
        id: creationData.id, // Fournir l'ID des mocks pour la cohérence
        title: creationData.title,
        description: creationData.description || '',
        image: creationData.imageUrl, // Utiliser 'image' (Prisma) avec 'imageUrl' (données mock)
        createdAt: creationData.createdAt,
        updatedAt: creationData.updatedAt,
        // category: creationData.category,
      },
    });
    console.log(`Création créée ou mise à jour avec id: ${creation.id}`);
  }
  console.log('Seeding Créations terminé.');

  // --- Seed Recettes (Exemple, à adapter) ---
  // console.log('Seeding Recettes...');
  // for (const recipeData of mockRecipesData) {
  //   const recipe = await prisma.recipe.upsert({
  //     where: { id: recipeData.id },
  //     update: {
  //       title: recipeData.title,
  //       // Adapter les champs: steps et ingredients sont String[] dans Prisma
  //       steps: recipeData.steps, // Supposant que mockRecipesData.steps est déjà String[]
  //       ingredients: recipeData.ingredients.map(ing => `${ing.quantity} ${ing.name}`), // Transformer les ingrédients en strings
  //       image: recipeData.imageUrl,
  //       createdAt: recipeData.createdAt, // Supposant que les mocks ont ces champs
  //       updatedAt: recipeData.updatedAt,
  //       // Ajouter les champs manquants: prepTime, cookTime, servings, etc.
  //     },
  //     create: {
  //       id: recipeData.id,
  //       title: recipeData.title,
  //       steps: recipeData.steps,
  //       ingredients: recipeData.ingredients.map(ing => `${ing.quantity} ${ing.name}`),
  //       image: recipeData.imageUrl,
  //       createdAt: recipeData.createdAt,
  //       updatedAt: recipeData.updatedAt,
  //       // Ajouter les champs manquants
  //     },
  //   });
  //   console.log(`Recette créée ou mise à jour avec id: ${recipe.id}`);
  // }
  // console.log('Seeding Recettes terminé.');


  // --- Seed Articles (Exemple, à adapter) ---
  // console.log('Seeding Articles...');
  // for (const articleData of mockArticlesData) {
  //   const article = await prisma.article.upsert({
  //     where: { id: articleData.id },
  //     update: {
  //       title: articleData.title,
  //       content: articleData.content,
  //       tags: articleData.tags || [], // Assurer que tags est un tableau
  //       createdAt: articleData.createdAt, // Supposant que les mocks ont ces champs
  //       updatedAt: articleData.updatedAt,
  //       // Ajouter les champs manquants: imageUrl, author, etc.
  //     },
  //     create: {
  //       id: articleData.id,
  //       title: articleData.title,
  //       content: articleData.content,
  //       tags: articleData.tags || [],
  //       createdAt: articleData.createdAt,
  //       updatedAt: articleData.updatedAt,
  //       // Ajouter les champs manquants
  //     },
  //   });
  //   console.log(`Article créé ou mis à jour avec id: ${article.id}`);
  // }
  // console.log('Seeding Articles terminé.');


  // --- Seed Admin User ---
  console.log('Seeding Admin User...');
  const adminEmail = 'Lionel.callerame@gmail.com';
  const plainPassword = 'Liocal241290'; // Mot de passe fourni
  const saltRounds = 10; // Coût du hachage bcrypt

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log(`Mot de passe haché pour ${adminEmail}.`);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        // Mettre à jour le mot de passe si l'utilisateur existe déjà
        password: hashedPassword,
        role: 'admin', // S'assurer que le rôle est admin
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        // Ajouter d'autres champs si nécessaire (ex: name)
        // name: 'Lionel Callerame',
      },
    });
    console.log(`Utilisateur admin créé ou mis à jour avec email: ${adminUser.email}`);
  } catch (error) {
    console.error(`Erreur lors de la création/mise à jour de l'utilisateur admin ${adminEmail}:`, error);
    // Ne pas arrêter le seeding complet si l'admin échoue, mais logger l'erreur
  }
  console.log('Seeding Admin User terminé.');


  console.log(`Seeding terminé.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });