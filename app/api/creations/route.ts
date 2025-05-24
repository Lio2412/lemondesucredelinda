import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from '@prisma/client';
import { createClient } from '@supabase/supabase-js'; // Importer createClient directement
// Ne plus importer supabaseAdmin d'ici
import { v4 as uuidv4 } from 'uuid'; // Pour générer des noms de fichiers uniques

const BUCKET_NAME = 'images'; // Utiliser le même bucket que les recettes pour la cohérence

export async function POST(req: Request) {
  const requestStartTime = Date.now();
  console.log('[DIAGNOSTIC iOS API] POST /api/creations démarré:', {
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get('user-agent'),
    contentType: req.headers.get('content-type'),
    contentLength: req.headers.get('content-length')
  });

  try {
    console.log('[DIAGNOSTIC iOS API] Lecture FormData...');
    const formData = await req.formData();
    console.log('[DIAGNOSTIC iOS API] FormData lu avec succès');
    
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;
    const publishedString = formData.get('published') as string | null; // Récupérer published

    console.log('[DIAGNOSTIC iOS API] Données extraites du FormData:', {
      title: title ? `"${title}"` : 'null',
      description: description ? `"${description.substring(0, 50)}..."` : 'null',
      hasImageFile: !!imageFile,
      imageFileName: imageFile?.name || 'N/A',
      imageFileType: imageFile?.type || 'N/A',
      imageFileSize: imageFile?.size || 'N/A',
      published: publishedString
    });

    // Validation des champs texte
    if (!title) {
      console.log('[DIAGNOSTIC iOS API] Erreur: Titre manquant');
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
    // La description est requise par le schéma Prisma
    if (description === null || description === undefined) {
        console.log('[DIAGNOSTIC iOS API] Erreur: Description manquante');
        return NextResponse.json({ error: "La description est requise." }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // Gérer l'upload de l'image si elle existe
    if (imageFile && imageFile.size > 0) {
      console.log('[DIAGNOSTIC iOS API] Début upload image vers Supabase...');
      
      // Lire les variables d'environnement Supabase DANS la fonction
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

      // Vérifier si les clés sont définies
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('[DIAGNOSTIC iOS API] URL Supabase ou Clé de Service manquante dans l\'environnement de l\'API. Impossible d\'uploader.');
        return NextResponse.json({ error: "Configuration serveur incomplète pour l'upload." }, { status: 500 });
      }

      // Créer une instance locale du client Supabase avec la clé de service
      const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
      console.log('[DIAGNOSTIC iOS API] Client Supabase créé');

      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`; // Nom de fichier unique
      const uploadedImagePath = `creations/${fileName}`; // Chemin dans le bucket avec préfixe

      console.log('[DIAGNOSTIC iOS API] Préparation upload:', {
        originalFileName: imageFile.name,
        newFileName: fileName,
        uploadPath: uploadedImagePath,
        fileSize: imageFile.size
      });

      // Utiliser le client local supabaseAdminClient pour l'upload
      const uploadStartTime = Date.now();
      const { data: uploadData, error: uploadError } = await supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .upload(uploadedImagePath, imageFile);
      const uploadEndTime = Date.now();

      console.log('[DIAGNOSTIC iOS API] Résultat upload Supabase:', {
        success: !uploadError,
        duration: uploadEndTime - uploadStartTime,
        uploadData,
        uploadError: uploadError ? {
          message: uploadError.message,
          name: uploadError.name,
          cause: uploadError.cause
        } : null
      });

      if (uploadError) {
        console.error("[DIAGNOSTIC iOS API] Erreur d'upload Supabase:", uploadError);
        throw new Error(`Erreur lors de l'upload de l'image: ${uploadError.message}`);
      }

      // Appel à la fonction Edge image-converter
      console.log(`[DIAGNOSTIC iOS API] Appel de image-converter pour: ${uploadedImagePath}`);
      const conversionStartTime = Date.now();
      const { data: conversionResult, error: conversionFnError } = await supabaseAdminClient.functions.invoke('image-converter', {
        body: { bucketName: BUCKET_NAME, filePath: uploadedImagePath }
      });
      const conversionEndTime = Date.now();

      let finalImagePath = uploadedImagePath; // Par défaut, l'image originale

      console.log('[DIAGNOSTIC iOS API] Résultat conversion:', {
        success: !conversionFnError,
        duration: conversionEndTime - conversionStartTime,
        conversionResult,
        conversionError: conversionFnError ? {
          message: conversionFnError.message,
          name: conversionFnError.name
        } : null
      });

      if (conversionFnError) {
        console.error('[DIAGNOSTIC iOS API] Erreur fonction Edge image-converter:', conversionFnError.message);
        // Continuer avec l'image originale si la conversion échoue
      } else if (conversionResult) {
        console.log('[DIAGNOSTIC iOS API] Résultat image-converter:', conversionResult);
        finalImagePath = conversionResult.newFilePath || conversionResult.originalFilePath || uploadedImagePath;
      }
      
      console.log(`[DIAGNOSTIC iOS API] Chemin final de l'image après conversion (ou non): ${finalImagePath}`);

      // Obtenir l'URL publique avec le client local
      const { data: publicUrlData } = supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(finalImagePath); // Utiliser finalImagePath

      console.log('[DIAGNOSTIC iOS API] URL publique générée:', {
        success: !!publicUrlData?.publicUrl,
        publicUrl: publicUrlData?.publicUrl || 'N/A'
      });

      if (!publicUrlData?.publicUrl) {
         console.error("[DIAGNOSTIC iOS API] Impossible d'obtenir l'URL publique pour:", finalImagePath);
         // Que faire ici ? Continuer sans image ou retourner une erreur ?
         // Pour l'instant, on continue sans image, mais on logue l'erreur.
         imageUrl = null;
      } else {
        imageUrl = publicUrlData.publicUrl;
      }

    } else {
      console.log('[DIAGNOSTIC iOS API] Aucune image à uploader');
    }

    // Enregistrer dans Prisma
    console.log('[DIAGNOSTIC iOS API] Enregistrement dans Prisma...');
    const prismaStartTime = Date.now();
    const creation = await prisma.creation.create({
      data: {
        title: title,
        description: description, // Utiliser la description vérifiée
        image: imageUrl,         // Utiliser l'URL de l'image uploadée ou null
        published: publishedString === 'true', // Convertir en booléen et inclure
        // 'createdAt', 'updatedAt' utiliseront les valeurs par défaut définies dans le schéma
      },
      // Pas besoin de select ici, Prisma retourne tous les champs scalaires par défaut
    });
    const prismaEndTime = Date.now();

    console.log('[DIAGNOSTIC iOS API] Création enregistrée avec succès:', {
      id: creation.id,
      title: creation.title,
      hasImage: !!creation.image,
      published: creation.published,
      prismaDuration: prismaEndTime - prismaStartTime,
      totalDuration: Date.now() - requestStartTime
    });

    return NextResponse.json(creation);

  } catch (error) {
    const errorEndTime = Date.now();
    console.error("[DIAGNOSTIC iOS API] Erreur détaillée lors de la création de la création:", {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      totalDuration: errorEndTime - requestStartTime,
      timestamp: new Date().toISOString()
    });
    
    let errorMessage = "Erreur serveur lors de la création.";
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('[DIAGNOSTIC iOS API] Erreur Prisma connue:', error.code);
      if (error.code === 'P2002') {
        errorMessage = "Une création avec des informations similaires existe déjà.";
        statusCode = 409;
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        console.log('[DIAGNOSTIC iOS API] Erreur validation Prisma');
        errorMessage = "Données invalides fournies pour la création.";
        statusCode = 400;
    } else if (error instanceof Error) {
       // Capturer les erreurs spécifiques (ex: upload)
       console.log('[DIAGNOSTIC iOS API] Erreur générique:', error.message);
       errorMessage = error.message || errorMessage;
       // Si l'erreur vient de l'upload, on pourrait vouloir un code différent, ex: 500 ou 400
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}