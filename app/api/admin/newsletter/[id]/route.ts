import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
// Importer ici la logique de vérification d'authentification si nécessaire
// Exemple: import { isAdmin } from '@/lib/auth'; // Supposons une fonction qui vérifie les droits admin

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaignId = params.id;

  // --- Vérification d'authentification (Exemple basique) ---
  // À adapter selon la méthode d'authentification réelle du projet (middleware, session, etc.)
  // Le middleware devrait déjà protéger cette route, mais une vérification supplémentaire est une bonne pratique.
  // const userIsAdmin = await isAdmin(request); // Exemple avec une fonction d'aide
  // if (!userIsAdmin) {
  //   return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  // }
  // --- Fin Vérification ---

  if (!campaignId) {
    return NextResponse.json({ error: 'ID de campagne manquant' }, { status: 400 });
  }

  try {
    await prisma.newsletterCampaign.delete({
      where: { id: campaignId },
    });

    console.log(`[API] Newsletter Campaign supprimée: ${campaignId}`);
    return NextResponse.json({ message: 'Newsletter supprimée avec succès' }, { status: 200 });

  } catch (error: any) {
    console.error(`[API] Erreur lors de la suppression de la newsletter ${campaignId}:`, error);
    // Gérer le cas où l'enregistrement n'existe pas (P2025)
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Newsletter non trouvée' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur lors de la suppression de la newsletter', details: error.message }, { status: 500 });
  }
}