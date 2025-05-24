import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client'; // Importer Prisma pour les types d'erreur

const BUCKET_NAME = 'images'; // Utiliser le même bucket que les recettes pour la cohérence
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // La vérification d'authentification sera ajoutée lorsque le système d'auth sera implémenté.

  const creationId = params.id;

  if (!creationId) {
    return NextResponse.json({ error: 'ID de création manquant' }, { status: 400 });
  }

  try {
    await prisma.creation.delete({
      where: { id: creationId },
    });

    console.log(`Création supprimée: ${creationId}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(`Erreur lors de la suppression de la création ${creationId}:`, error);
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Création non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}



// Schéma Zod optionnel pour la validation de la mise à jour
// const updateCreationSchema = z.object({
//   title: z.string().min(3).optional(),
//   description: z.string().optional(),
//   image: z.string().url().optional(),
// });

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const creationId = params.id;
  if (!creationId) {
    return NextResponse.json({ error: 'ID de création manquant' }, { status: 400 });
  }

  // Variables pour les données et l'image
  let title: string | null = null;
  let description: string | null = null;
  let published: boolean | undefined = undefined; // Variable pour stocker la valeur booléenne
  let imageFile: File | null = null;
  let newImageUrl: string | null = null;
  let dataToUpdate: Prisma.CreationUpdateInput = {}; // Initialiser l'objet de mise à jour

  try {
    // --- Lire les variables d'environnement Supabase une seule fois ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

    // Vérifier si les clés sont définies (nécessaire uniquement si upload/delete est possible)
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      // On ne bloque pas ici, mais on logue une erreur si une opération Supabase est tentée plus tard sans clés
      console.error('URL Supabase ou Clé de Service manquante dans l\'environnement de l\'API.');
      // On pourrait retourner une erreur 500 ici si l'upload est *toujours* requis ou une fonctionnalité clé
    }

    // Créer le client Supabase une seule fois (si les clés existent)
    const supabaseAdminClient = (supabaseUrl && supabaseServiceRoleKey)
      ? createClient(supabaseUrl, supabaseServiceRoleKey)
      : null;


    const contentType = req.headers.get('content-type');

    // --- 1. Extraire les données selon le Content-Type ---
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = formData.get('title') as string | null;
      description = formData.get('description') as string | null;
      imageFile = formData.get('image') as File | null;
      const publishedString = formData.get('published') as string | null; // Lire depuis FormData
      published = publishedString === 'true'; // Convertir en booléen
    } else if (contentType?.includes('application/json')) {
      const jsonData = await req.json();
      title = jsonData.title;
      description = jsonData.description;
      published = jsonData.published; // Lire depuis JSON (devrait être booléen)
      // Pas d'imageFile dans ce cas
    } else {
      return NextResponse.json({ error: 'Type de contenu non supporté' }, { status: 415 });
    }

    // --- 2. Validation des champs texte ---
    if (!title) {
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
     // La description est requise par le schéma Prisma
    if (description === null || description === undefined) {
        return NextResponse.json({ error: "La description est requise." }, { status: 400 });
    }

    // Ajouter title et description aux données à mettre à jour
    dataToUpdate.title = title;
    dataToUpdate.description = description;
    // Ajouter published à dataToUpdate s'il a été défini
    if (published !== undefined) {
      dataToUpdate.published = published;
    }

    let oldImageUrl: string | null = null;

    // --- 3. Gérer l'upload si une nouvelle image est fournie ---
    if (imageFile && imageFile.size > 0) {
      // Récupérer l'URL de l'ancienne image AVANT de mettre à jour
      const existingCreation = await prisma.creation.findUnique({
        where: { id: creationId },
        select: { image: true },
      });
      if (existingCreation) {
        oldImageUrl = existingCreation.image;
      }

      // Vérifier si le client Supabase a pu être créé
      if (!supabaseAdminClient) {
         console.error("Client Supabase non initialisé à cause de variables d'environnement manquantes.");
         return NextResponse.json({ error: "Configuration serveur incomplète pour l'upload." }, { status: 500 });
      }

      // Upload de la nouvelle image
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const uploadedImagePath = `creations/${fileName}`; // Chemin avec préfixe

      const { error: uploadError } = await supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .upload(uploadedImagePath, imageFile);

      if (uploadError) {
        console.error("Erreur d'upload Supabase:", uploadError);
        throw new Error(`Erreur lors de l'upload de l'image: ${uploadError.message}`);
      }

      // Appel à la fonction Edge image-converter
      console.log(`[API Creations PUT] Appel de image-converter pour: ${uploadedImagePath}`);
      const { data: conversionResult, error: conversionFnError } = await supabaseAdminClient.functions.invoke('image-converter', {
        body: { bucketName: BUCKET_NAME, filePath: uploadedImagePath }
      });

      let finalImagePath = uploadedImagePath; // Par défaut, l'image originale

      if (conversionFnError) {
        console.error('[API Creations PUT] Erreur fonction Edge image-converter:', conversionFnError.message);
        // Continuer avec l'image originale si la conversion échoue
      } else if (conversionResult) {
        console.log('[API Creations PUT] Résultat image-converter:', conversionResult);
        finalImagePath = conversionResult.newFilePath || conversionResult.originalFilePath || uploadedImagePath;
      }
      
      console.log(`[API Creations PUT] Chemin final de l'image après conversion (ou non): ${finalImagePath}`);

      // Obtenir l'URL publique avec le chemin final
      const { data: publicUrlData } = supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(finalImagePath);

      if (publicUrlData?.publicUrl) {
        newImageUrl = publicUrlData.publicUrl;
        dataToUpdate.image = newImageUrl;
        console.log("URL publique obtenue :", newImageUrl);
      } else {
        console.error("Impossible d'obtenir l'URL publique pour:", finalImagePath);
        newImageUrl = oldImageUrl; // Garder l'ancienne URL en cas d'échec
      }
    }
    // Si aucune nouvelle image n'est fournie, dataToUpdate.image reste non défini,
    // donc Prisma ne mettra pas à jour le champ image.

    // --- 4. Mettre à jour Prisma ---
    const updatedCreation = await prisma.creation.update({
      where: { id: creationId },
      data: dataToUpdate,
    });

    // --- 5. Supprimer l'ancienne image de Supabase si une nouvelle a été uploadée avec succès ---
    if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
      try {
        const oldFileName = oldImageUrl.split('/').pop(); // Extraire le nom du fichier de l'URL
        if (oldFileName && supabaseAdminClient) { // Vérifier aussi que le client existe
           const { error: deleteError } = await supabaseAdminClient.storage
            .from(BUCKET_NAME)
            .remove([oldFileName]);
          if (deleteError) {
            console.error(`Erreur lors de la suppression de l'ancienne image ${oldFileName}:`, deleteError);
            // Ne pas bloquer la réponse pour ça, juste logguer
          } else {
            console.log(`Ancienne image ${oldFileName} supprimée avec succès.`);
          }
        }
      } catch (deleteCatchError) {
         console.error(`Erreur inattendue lors de la tentative de suppression de l'ancienne image ${oldImageUrl}:`, deleteCatchError);
      }
    }


    console.log(`Création mise à jour: ${creationId}`);
    return NextResponse.json(updatedCreation);

  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la création ${creationId}:`, error);
    // Gestion des erreurs Prisma et autres
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Création non trouvée' }, { status: 404 });
        }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json({ error: 'Données invalides fournies pour la mise à jour.' }, { status: 400 });
    } else if (error instanceof Error) {
       // Capturer les erreurs spécifiques (ex: upload)
       return NextResponse.json({ error: error.message || 'Erreur interne du serveur' }, { status: 500 });
    }
    // Erreur générique
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// La fonction PUT gère maintenant JSON et FormData avec upload/suppression d'image.