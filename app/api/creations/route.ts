import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from '@prisma/client';
import { createClient } from '@supabase/supabase-js'; // Importer createClient directement
// Ne plus importer supabaseAdmin d'ici
import { v4 as uuidv4 } from 'uuid'; // Pour générer des noms de fichiers uniques

const BUCKET_NAME = 'creations'; // Nom du bucket fourni par l'utilisateur

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    // Validation des champs texte
    if (!title) {
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
    // La description est requise par le schéma Prisma
    if (description === null || description === undefined) {
        return NextResponse.json({ error: "La description est requise." }, { status: 400 });
    }


    let imageUrl: string | null = null;

    // Gérer l'upload de l'image si elle existe
    if (imageFile && imageFile.size > 0) {
      // Lire les variables d'environnement Supabase DANS la fonction
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

      // Vérifier si les clés sont définies
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('URL Supabase ou Clé de Service manquante dans l\'environnement de l\'API. Impossible d\'uploader.');
        return NextResponse.json({ error: "Configuration serveur incomplète pour l'upload." }, { status: 500 });
      }

      // Créer une instance locale du client Supabase avec la clé de service
      const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`; // Nom de fichier unique
      const filePath = `${fileName}`; // Chemin dans le bucket

      // Utiliser supabaseAdmin pour l'upload (contourne RLS)
      // Utiliser le client local supabaseAdminClient pour l'upload
      const { data: uploadData, error: uploadError } = await supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Erreur d'upload Supabase:", uploadError);
        throw new Error(`Erreur lors de l'upload de l'image: ${uploadError.message}`);
      }

      // Obtenir l'URL publique avec le client local
      const { data: publicUrlData } = supabaseAdminClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
         console.error("Impossible d'obtenir l'URL publique pour:", filePath);
         // Que faire ici ? Continuer sans image ou retourner une erreur ?
         // Pour l'instant, on continue sans image, mais on logue l'erreur.
         imageUrl = null;
      } else {
        imageUrl = publicUrlData.publicUrl;
      }

    }

    // Enregistrer dans Prisma
    const creation = await prisma.creation.create({
      data: {
        title: title,
        description: description, // Utiliser la description vérifiée
        image: imageUrl,         // Utiliser l'URL de l'image uploadée ou null
        // 'published', 'createdAt', 'updatedAt' utiliseront les valeurs par défaut définies dans le schéma
      },
      // Pas besoin de select ici, Prisma retourne tous les champs scalaires par défaut
    });

    return NextResponse.json(creation);

  } catch (error) {
    console.error("Erreur détaillée lors de la création de la création:", error);
    let errorMessage = "Erreur serveur lors de la création.";
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        errorMessage = "Une création avec des informations similaires existe déjà.";
        statusCode = 409;
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        errorMessage = "Données invalides fournies pour la création.";
        statusCode = 400;
    } else if (error instanceof Error) {
       // Capturer les erreurs spécifiques (ex: upload)
       errorMessage = error.message || errorMessage;
       // Si l'erreur vient de l'upload, on pourrait vouloir un code différent, ex: 500 ou 400
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}