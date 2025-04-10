import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod'; // Importer Zod

// Nom du bucket Supabase Storage
const BUCKET_NAME = 'images';

// Helper function to extract file path from Supabase URL
const getPathFromSupabaseUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);
    const pathPrefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
    if (urlObject.pathname.startsWith(pathPrefix)) {
      return urlObject.pathname.substring(pathPrefix.length);
    }
    return null;
  } catch (error) {
    console.error("Erreur extraction chemin URL Supabase:", error);
    return null;
  }
};

// Schémas Zod pour parser les données reçues
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


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Auth check needed here later
  const recipeId = params.id;

  if (!recipeId) {
    return NextResponse.json({ error: 'ID recette manquant' }, { status: 400 });
  }

  try {
    // Note: La suppression des ingrédients/étapes est gérée par `onDelete: Cascade` dans le schéma Prisma.
    // Il faut juste supprimer l'image de Supabase.

    // 1. Récupérer l'URL de l'image avant de supprimer la recette
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { image: true },
    });

    // 2. Supprimer la recette de Prisma (les relations seront supprimées en cascade)
    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    // 3. Si une image existait, la supprimer de Supabase
    if (recipe?.image) {
      const imagePath = getPathFromSupabaseUrl(recipe.image);
      if (imagePath) {
        console.log(`Tentative suppression image: ${imagePath}`);
        const { error: deleteError } = await supabaseAdmin
          .storage
          .from(BUCKET_NAME)
          .remove([imagePath]);

        if (deleteError) {
          console.error(`Erreur suppression image ${imagePath} Supabase:`, deleteError);
        } else {
          console.log(`Image ${imagePath} supprimée Supabase.`);
        }
      }
    }

    console.log(`Recette supprimée: ${recipeId}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(`Erreur suppression recette ${recipeId}:`, error);
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Auth check needed here later

  const recipeId = params.id;
  if (!recipeId) {
    return NextResponse.json({ error: 'ID recette manquant' }, { status: 400 });
  }

  try {
    let title: string;
    let slug: string;
    let description: string | undefined;
    let difficulty: string | undefined;
    let prepTime: number | undefined;
    let cookTime: number | undefined;
    let basePortions: number;
    let category: string | undefined;
    let ingredients: IngredientData[];
    let steps: StepData[];
    let imageFile: File | undefined = undefined;
    let newImageUrl: string | undefined = undefined; // URL finale à sauvegarder
    let oldImageUrl: string | undefined = undefined; // URL actuelle si une nouvelle image est fournie

    const contentType = req.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = formData.get('title') as string;
      slug = formData.get('slug') as string;
      description = formData.get('description') as string | undefined;
      difficulty = formData.get('difficulty') as string | undefined;
      prepTime = formData.get('prepTime') ? parseInt(formData.get('prepTime') as string, 10) : undefined;
      cookTime = formData.get('cookTime') ? parseInt(formData.get('cookTime') as string, 10) : undefined;
      basePortions = parseInt(formData.get('basePortions') as string, 10);
      category = formData.get('category') as string | undefined;
      const ingredientsStr = formData.get('ingredients') as string;
      const stepsStr = formData.get('steps') as string;
      const image = formData.get('image') as File | null;
      oldImageUrl = formData.get('currentImageUrl') as string | undefined; // Récupérer l'URL actuelle

      if (!title || !slug || !basePortions || !ingredientsStr || !stepsStr) {
        return NextResponse.json({ error: 'Données FormData manquantes' }, { status: 400 });
      }

      try {
        ingredients = z.array(ingredientSchema).min(1).parse(JSON.parse(ingredientsStr));
        steps = z.array(stepSchema).min(1).parse(JSON.parse(stepsStr));
      } catch (e) {
        return NextResponse.json({ error: 'Données ingrédients/étapes invalides', details: e }, { status: 400 });
      }

      if (image) {
        imageFile = image;
        // oldImageUrl est déjà récupéré du formulaire
      } else {
        // Pas de nouvelle image, on garde l'ancienne URL
        newImageUrl = oldImageUrl;
      }

    } else if (contentType?.includes('application/json')) {
      const jsonData = await req.json();
      // Valider jsonData
      title = jsonData.title;
      slug = jsonData.slug;
      description = jsonData.description;
      difficulty = jsonData.difficulty;
      prepTime = jsonData.prepTime;
      cookTime = jsonData.cookTime;
      basePortions = jsonData.basePortions;
      category = jsonData.category;
      ingredients = z.array(ingredientSchema).min(1).parse(jsonData.ingredients);
      steps = z.array(stepSchema).min(1).parse(jsonData.steps);
      // Si image est une string dans JSON, c'est l'URL actuelle (ou une nouvelle si on change via URL)
      if (typeof jsonData.image === 'string') {
        newImageUrl = jsonData.image;
      } else {
        // Si image n'est pas une string (ou absente), on suppose qu'on ne change pas l'image
        // Il faudrait récupérer l'URL actuelle de la BDD si on veut être sûr
        const currentRecipe = await prisma.recipe.findUnique({ where: { id: recipeId }, select: { image: true } });
        newImageUrl = currentRecipe?.image ?? undefined;
      }
    } else {
      return NextResponse.json({ error: 'Content-Type non supporté' }, { status: 415 });
    }

    // --- Gestion de l'upload et suppression d'image ---
    if (imageFile) {
      // 1. Uploader la nouvelle image
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `recipes/${fileName}`;

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Erreur upload Supabase:", uploadError);
        throw new Error("Impossible d'uploader la nouvelle image.");
      }

      // 2. Obtenir l'URL publique
      const { data: publicUrlData } = supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

       if (!publicUrlData?.publicUrl) {
         console.error("Erreur récupération URL publique Supabase:", filePath);
         throw new Error("Impossible d'obtenir l'URL publique.");
       }
       newImageUrl = publicUrlData.publicUrl; // Mettre à jour avec la nouvelle URL
       console.log(`Nouvelle image uploadée: ${newImageUrl}`);

      // 3. Supprimer l'ancienne image si elle existait
      if (oldImageUrl) {
        const oldImagePath = getPathFromSupabaseUrl(oldImageUrl);
        if (oldImagePath) {
          console.log(`Tentative suppression ancienne image: ${oldImagePath}`);
          const { error: deleteError } = await supabaseAdmin
            .storage
            .from(BUCKET_NAME)
            .remove([oldImagePath]);
          if (deleteError) {
            console.error(`Erreur suppression ancienne image ${oldImagePath}:`, deleteError);
          } else {
             console.log(`Ancienne image ${oldImagePath} supprimée.`);
          }
        }
      }
    }
    // --- Fin Gestion ---

    // Utiliser une transaction Prisma pour mettre à jour la recette et ses relations
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour les champs simples de la recette
      const recipeUpdate = await tx.recipe.update({
        where: { id: recipeId },
        data: {
          title,
          slug,
          description,
          difficulty,
          prepTime,
          cookTime,
          basePortions,
          category,
          image: newImageUrl, // Utiliser la nouvelle URL ou l'ancienne conservée
        },
      });

      // 2. Supprimer les anciens ingrédients et étapes associés
      await tx.ingredient.deleteMany({ where: { recipeId: recipeId } });
      await tx.recipeStep.deleteMany({ where: { recipeId: recipeId } });

      // 3. Créer les nouveaux ingrédients
      await tx.ingredient.createMany({
        data: ingredients.map((ing) => ({
          ...ing,
          recipeId: recipeId,
        })),
      });

      // 4. Créer les nouvelles étapes
      await tx.recipeStep.createMany({
        data: steps.map((step, index) => ({
          order: index + 1,
          description: step.description,
          duration: step.duration,
          recipeId: recipeId,
        })),
      });

      // Retourner la recette mise à jour (sans relations pour la réponse)
      return recipeUpdate;
    });

    console.log(`Recette mise à jour: ${recipeId}`);
    return NextResponse.json(updatedRecipe); // Retourner la recette mise à jour

  } catch (error) {
    console.error(`Erreur mise à jour recette ${recipeId}:`, error);
    let errorMessage = 'Erreur interne serveur';
    let statusCode = 500;

     if (error instanceof z.ZodError) {
        errorMessage = 'Données invalides';
        statusCode = 400;
    } else if (error instanceof Error) {
        errorMessage = error.message;
        if ('code' in error) {
            if (error.code === 'P2025') { // Record not found (pour l'update initial)
                errorMessage = 'Recette non trouvée';
                statusCode = 404;
            } else if (error.code === 'P2002' && 'meta' in error && typeof error.meta === 'object' && error.meta && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('slug')) {
                errorMessage = 'Ce slug est déjà utilisé par une autre recette.';
                statusCode = 409; // Conflict
            }
        }
    }

    // TODO: Compensation plus complexe si nécessaire (ex: re-supprimer la nouvelle image si transaction échoue après upload)

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
