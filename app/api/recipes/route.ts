import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod'; // Importer Zod pour parser les données
import { RecipeCategory } from '@prisma/client'; // Importer l'enum RecipeCategory
import slugify from 'slugify'; // Importer slugify pour générer des slugs

// Nom du bucket Supabase Storage
const BUCKET_NAME = 'images';

// Schémas Zod pour parser les données reçues (correspondant à RecipeFormValues)
const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});

const stepSchema = z.object({
  description: z.string().min(10),
  duration: z.number().int().positive().optional(),
});

type IngredientData = z.infer<typeof ingredientSchema>;
type StepData = z.infer<typeof stepSchema>;

export async function POST(req: Request) {
  // Auth check needed here later

  try {
    let title: string;
    // let slug: string; // Supprimé
    let description: string | undefined;
    let difficulty: string | undefined;
    let prepTime: number | undefined;
    let cookTime: number | undefined;
    let basePortions: number;
    let category: RecipeCategory; // Type mis à jour vers l'enum (requis par le formulaire)
    let ingredients: IngredientData[];
    let steps: StepData[];
    let published: boolean = false; // Initialiser published
    let imageFile: File | undefined = undefined;
    let imageUrl: string | undefined = undefined; // Pour l'URL finale

    const contentType = req.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = formData.get('title') as string;
      description = formData.get('description') as string | undefined;
      difficulty = formData.get('difficulty') as string | undefined;
      prepTime = formData.get('prepTime') ? parseInt(formData.get('prepTime') as string, 10) : undefined;
      cookTime = formData.get('cookTime') ? parseInt(formData.get('cookTime') as string, 10) : undefined;
      basePortions = parseInt(formData.get('basePortions') as string, 10);
      const categoryStr = formData.get('category') as string | null; // Lire comme string
      const ingredientsStr = formData.get('ingredients') as string;
      const stepsStr = formData.get('steps') as string;
      const publishedStr = formData.get('published') as string | null; // Récupérer published
      const image = formData.get('image') as File | null;

      // Vérifier les champs requis
      if (!title || !basePortions || !categoryStr || !ingredientsStr || !stepsStr) {
        return NextResponse.json({ error: 'Données FormData manquantes ou invalides' }, { status: 400 });
      }

      // Valider la catégorie reçue contre l'enum
      const categoryValidation = z.nativeEnum(RecipeCategory).safeParse(categoryStr);
      if (!categoryValidation.success) {
        return NextResponse.json({ error: 'Catégorie invalide', details: categoryValidation.error }, { status: 400 });
      }
      category = categoryValidation.data; // Assigner la valeur validée de l'enum

      // Parser et valider les ingrédients/étapes JSON stringifiés
      try {
        ingredients = z.array(ingredientSchema).min(1).parse(JSON.parse(ingredientsStr));
        steps = z.array(stepSchema).min(1).parse(JSON.parse(stepsStr));
      } catch (e) {
        return NextResponse.json({ error: 'Données ingrédients/étapes invalides', details: e }, { status: 400 });
      }
      // Convertir published (vient de FormData comme string 'true'/'false')
      published = publishedStr === 'true';

      if (image) {
        imageFile = image;
      }

    } else if (contentType?.includes('application/json')) {
      const jsonData = await req.json();
      // Valider toutes les données JSON avec un schéma global si nécessaire (ou individuellement)
      title = jsonData.title;
      description = jsonData.description;
      difficulty = jsonData.difficulty;
      prepTime = jsonData.prepTime;
      cookTime = jsonData.cookTime;
      basePortions = jsonData.basePortions;
      // Valider la catégorie reçue contre l'enum
      const categoryValidationJson = z.nativeEnum(RecipeCategory).safeParse(jsonData.category);
       if (!categoryValidationJson.success) {
        return NextResponse.json({ error: 'Catégorie invalide', details: categoryValidationJson.error }, { status: 400 });
      }
      category = categoryValidationJson.data; // Assigner la valeur validée de l'enum
      ingredients = z.array(ingredientSchema).min(1).parse(jsonData.ingredients); // Valider
      steps = z.array(stepSchema).min(1).parse(jsonData.steps); // Valider
      published = typeof jsonData.published === 'boolean' ? jsonData.published : false; // Récupérer published du JSON
      if (typeof jsonData.image === 'string') {
        imageUrl = jsonData.image; // Peu probable en création, mais possible
      }
    } else {
      return NextResponse.json({ error: 'Content-Type non supporté' }, { status: 415 });
    }

    // --- Gestion de l'upload d'image ---
    if (imageFile) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `recipes/${fileName}`;

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Erreur d'upload Supabase:", uploadError);
        throw new Error("Impossible d'uploader l'image.");
      }

      const { data: publicUrlData } = supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
         console.error("Erreur récupération URL publique Supabase:", filePath);
         throw new Error("Impossible d'obtenir l'URL publique de l'image.");
      }
      imageUrl = publicUrlData.publicUrl;
    }
    // --- Fin Gestion de l'upload d'image ---

    // Générer un slug unique à partir du titre
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    
    // Vérifier si le slug existe déjà et générer un slug unique si nécessaire
    let slugExists = await prisma.recipe.findUnique({ where: { slug } });
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      slugExists = await prisma.recipe.findUnique({ where: { slug } });
    }

    // Utiliser une transaction Prisma pour créer la recette et ses relations
    // Force update check

    const newRecipe = await prisma.$transaction(async (tx) => {
      const createdRecipe = await tx.recipe.create({
        data: {
          title,
          slug, // Ajouter le slug généré
          description,
          difficulty,
          prepTime,
          cookTime,
          basePortions,
          category,
          image: imageUrl,
          published, // Ajouter published aux données Prisma
          // Ne pas inclure ingredients et steps ici, on les crée séparément
        },
      });

      // Créer les ingrédients associés
      await tx.ingredient.createMany({
        data: ingredients.map((ing) => ({
          ...ing, // name, quantity, unit
          recipeId: createdRecipe.id,
        })),
      });

      // Créer les étapes associées avec leur ordre
      await tx.recipeStep.createMany({
        data: steps.map((step, index) => ({
          order: index + 1, // Utiliser l'index comme ordre
          description: step.description,
          duration: step.duration,
          recipeId: createdRecipe.id,
        })),
      });

      // Retourner la recette créée (sans les relations pour la réponse initiale)
      return createdRecipe;
    });


    revalidateTag('recipes'); // Revalider la liste des recettes
    // Le tag spécifique à la recette n'est pas utile ici car la page de détail utilise un slug qui est généré
    // et ne peut pas être connu à l'avance pour revalider un tag comme `recipe-${newRecipe.id}`.
    // revalidatePath pourrait être utilisé si on connaissait le slug exact, mais revalidateTag('recipes')
    // couvrira la liste et la nouvelle recette sera récupérable.

    console.log(`Nouvelle recette créée: ${newRecipe.id}`);
    // Retourner la recette simple, ou la re-fetcher avec relations si nécessaire
    return NextResponse.json(newRecipe, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de la création de la recette:", error);
    let errorMessage = 'Erreur interne du serveur';
    let statusCode = 500;

    if (error instanceof z.ZodError) {
        errorMessage = 'Données invalides';
        statusCode = 400;
    } else if (error instanceof Error) {
        errorMessage = error.message;
        // La gestion d'erreur spécifique au slug unique n'est plus nécessaire
        // if ('code' in error && error.code === 'P2002' && ...) { ... }
    }

    // TODO: Compensation: Supprimer l'image uploadée si la transaction échoue ?

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}