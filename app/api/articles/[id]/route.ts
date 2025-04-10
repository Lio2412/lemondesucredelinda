import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // La vérification d'authentification sera ajoutée lorsque le système d'auth sera implémenté.

  const articleId = params.id;

  if (!articleId) {
    return NextResponse.json({ error: 'ID d\'article manquant' }, { status: 400 });
  }

  try {
    await prisma.article.delete({
      where: { id: articleId },
    });

    console.log(`Article supprimé: ${articleId}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(`Erreur lors de la suppression de l'article ${articleId}:`, error);
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
       return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // La vérification d'authentification sera ajoutée lorsque le système d'auth sera implémenté.

  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ error: 'ID d\'article manquant' }, { status: 400 });
  }

  try {
    const data = await req.json();

    // Optionnel: Ajouter une validation plus robuste des données reçues (ex: avec Zod)
    // Validation simple des champs requis (similaire à POST)
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.publishedAt) {
      return NextResponse.json({ error: "Les champs titre, slug, extrait, contenu et date de publication sont requis pour la mise à jour." }, { status: 400 });
    }
    if (data.imageUrl && typeof data.imageUrl !== 'string') {
        return NextResponse.json({ error: "L'URL de l'image doit être une chaîne de caractères." }, { status: 400 });
    }
    if (isNaN(Date.parse(data.publishedAt))) {
        return NextResponse.json({ error: "Format de date de publication invalide." }, { status: 400 });
    }

    // Assurer que tags est un tableau, même vide
    const tags = Array.isArray(data.tags) ? data.tags : [];

    // Mettre à jour l'article avec tous les champs fournis
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
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

    console.log(`Article mis à jour: ${articleId}`);
    return NextResponse.json(updatedArticle);

  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'article ${articleId}:`, error);
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }
    // Gérer les erreurs de validation Zod si utilisées
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}


// La fonction PUT est implémentée ci-dessus.