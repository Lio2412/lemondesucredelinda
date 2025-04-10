import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Correction chemin relatif

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validation des champs requis (ajouter slug, excerpt, content, publishedAt)
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.publishedAt) {
      return NextResponse.json({ error: "Les champs titre, slug, extrait, contenu et date de publication sont requis." }, { status: 400 });
    }
    // Validation optionnelle de l'URL de l'image si fournie
    if (data.imageUrl && typeof data.imageUrl !== 'string') {
        return NextResponse.json({ error: "L'URL de l'image doit être une chaîne de caractères." }, { status: 400 });
    }
    // Validation du format de la date (ISO 8601 string attendue du JSON)
    if (isNaN(Date.parse(data.publishedAt))) {
        return NextResponse.json({ error: "Format de date de publication invalide." }, { status: 400 });
    }

    // Assurer que tags est un tableau, même vide, si non fourni ou null
    const tags = Array.isArray(data.tags) ? data.tags : [];

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: tags,
        publishedAt: new Date(data.publishedAt), // Convertir la string ISO en Date
        image: data.imageUrl || null, // Utiliser imageUrl, null si vide ou non fourni
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    // Fournir un message d'erreur plus spécifique si possible (ex: erreur Prisma)
    let errorMessage = "Erreur serveur lors de la création.";
    if (error instanceof Error) {
       // Vous pourriez vouloir inspecter l'erreur Prisma ici pour des détails
       // ex: if (error.code === 'P2002') errorMessage = "Un article avec ce titre existe déjà.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}