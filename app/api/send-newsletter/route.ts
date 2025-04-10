import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; // Utilisation de l'importation nommée
import { Resend } from 'resend';

// Initialiser Resend avec la clé API depuis les variables d'environnement
const resend = new Resend(process.env.RESEND_API_KEY);

// Template HTML pour l'email
const htmlTemplate = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Arial', sans-serif; background: #fff7f9; color: #2d2d2d; padding: 32px;">
  <tr>
    <td align="center">
      <h1 style="font-size: 28px; color: #e91e63;">Le Monde Sucré de Linda</h1>
      <p style="font-size: 18px;">🧁 Votre dose de douceur &amp; de créativité !</p>
    </td>
  </tr>
  <tr>
    <td style="padding: 24px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">{{title}}</h2>
      <p style="font-size: 16px; line-height: 1.6;">{{message}}</p>
      <br />
      À très vite pour de nouvelles douceurs !<br>
      — Linda 💕
    </td>
  </tr>
  <tr>
    <td align="center" style="padding-top: 32px; font-size: 12px; color: #888;">
      Vous recevez cet email car vous êtes inscrit à la newsletter du Monde Sucré.<br>
      <a href="#" style="color: #e91e63;">Se désabonner</a>
    </td>
  </tr>
</table>
`;

export async function POST(request: NextRequest) {
  try {
    // 1. Lire et valider le corps de la requête
    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      console.log('[Newsletter Send API] Validation échouée : titre ou message manquant.');
      return NextResponse.json({ error: 'Le titre et le message sont requis.' }, { status: 400 });
    }

    // 2. Récupérer les emails des abonnés depuis Prisma
    const subscribers = await prisma.newsletterSubscriber.findMany({
      select: { email: true },
    });

    if (!subscribers || subscribers.length === 0) {
      console.log('[Newsletter Send API] Aucun abonné trouvé.');
      return NextResponse.json({ message: 'Aucun abonné trouvé.' }, { status: 200 });
    }

    const emails = subscribers.map((sub: { email: string }) => sub.email); // Ajout du type explicite pour 'sub'
    let sentCount = 0;
    const errors = [];

    // 3. Préparer le contenu HTML dynamique
    const emailHtml = htmlTemplate
      .replace('{{title}}', title)
      .replace('{{message}}', message);

    // 4. Envoyer les emails en boucle
    for (const email of emails) {
      try {
        await resend.emails.send({
          from: 'Linda <newsletter@lemondesuredelinda.com>',
          to: [email],
          subject: title,
          html: emailHtml,
        });
        sentCount++;
      } catch (error) {
        console.error(`Erreur lors de l'envoi à ${email}:`, error);
        errors.push({ email, error });
      }
    }

    // 5. Gérer les réponses
    if (errors.length > 0) {
      // Si certains emails ont échoué mais d'autres ont réussi
      if (sentCount > 0) {
         return NextResponse.json({
           message: `Newsletter envoyée à ${sentCount} sur ${emails.length} abonnés. ${errors.length} erreurs rencontrées.`,
           errors: errors.map(e => e.email) // Optionnel: lister les emails en erreur
         }, { status: 207 }); // Multi-Status
      } else {
        // Si tous les emails ont échoué
        return NextResponse.json({ error: 'Échec de l\'envoi de tous les emails.', details: errors }, { status: 500 });
      }
    }

    // Le calcul de recipientCount a été déplacé plus haut

    // L'enregistrement de la campagne est géré par l'API admin maintenant
    // await prisma.newsletterCampaign.create({
    //   data: {
    //     title,
    //     message,
    //   },
    // });
    // 6. Réponse succès complet
    return NextResponse.json({ message: `Newsletter envoyée avec succès à ${sentCount} abonnés.` }, { status: 200 });

  } catch (error) {
    console.error('Erreur API send-newsletter:', error);
    // Gérer les erreurs générales (ex: problème de lecture du JSON, erreur Prisma non liée à l'envoi)
    if (error instanceof Error) {
        return NextResponse.json({ error: `Erreur interne du serveur: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur interne du serveur inconnue.' }, { status: 500 });
  }
}