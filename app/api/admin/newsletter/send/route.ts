import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma'; // Importation nommée

// Initialiser Resend avec la clé API depuis les variables d'environnement
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || "Linda <newsletter@lemondesucredelinda.com>"; // Utiliser une variable d'env ou une valeur par défaut

export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer et valider les données du corps de la requête
    const body = await request.json();
    const { title, message, scheduledAt: scheduledAtString } = body; // Ajout de scheduledAt

    if (!title || !message) {
      return NextResponse.json({ error: 'Titre et message sont requis.' }, { status: 400 });
    }

    // Convertir scheduledAt en objet Date si fourni et valide
    let scheduledDate: Date | null = null;
    if (scheduledAtString && typeof scheduledAtString === 'string') {
      try {
        const parsedDate = new Date(scheduledAtString);
        // Vérifier si la date est valide (non NaN)
        if (!isNaN(parsedDate.getTime())) {
          scheduledDate = parsedDate;
        } else {
          console.warn("Date de planification invalide reçue:", scheduledAtString);
          // Optionnel: retourner une erreur 400 ici si une date invalide est fournie ?
          // Pour l'instant, on traite comme non fournie.
        }
      } catch (e) {
        console.error("Erreur lors de la conversion de scheduledAt en Date:", e);
        // Traiter comme non fournie en cas d'erreur de parsing
      }
    }

    // --- Cas 1: Planification ---
    if (scheduledDate) {
      try {
        await prisma.newsletterCampaign.create({
          data: {
            title,
            message,
            scheduledAt: scheduledDate, // Enregistrer la date de planification
            // sentAt sera mis par défaut à now() par Prisma.
          },
        });
        console.log("Newsletter planifiée et enregistrée.");
        // Formatter la date pour la réponse
        const formattedDate = scheduledDate.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
        return NextResponse.json({ message: `Newsletter planifiée pour le ${formattedDate}.` }, { status: 200 });
      } catch (dbError) {
        console.error("Erreur lors de l'enregistrement de la campagne planifiée:", dbError);
        return NextResponse.json({ error: "Erreur lors de l'enregistrement de la planification." }, { status: 500 });
      }
    }
    // --- Cas 2: Envoi Immédiat ---
    else {
      // La logique d'envoi immédiat est déplacée ici

      // 2. Template HTML (identique à avant)
      const htmlTemplate = `
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Arial', sans-serif; background: #fff7f9; color: #2d2d2d; padding: 32px;">
          <tr><td align="center"><h1 style="font-size: 28px; color: #e91e63;">Le Monde Sucré de Linda</h1><p style="font-size: 18px;">🧁 Votre dose de douceur & de créativité !</p></td></tr>
          <tr><td style="padding: 24px; background: #ffffff; border-radius: 12px;"><h2 style="color: #333;">${title}</h2><p style="font-size: 16px; line-height: 1.6;">${message.replaceAll('\n', '<br/>')}</p><br/>— Linda 💕</td></tr>
          <tr><td align="center" style="font-size: 12px; color: #888;"><br/>Vous recevez cet email car vous êtes inscrit à la newsletter du Monde Sucré.<br/><a href="#" style="color: #e91e63;">Se désabonner</a></td></tr>
        </table>
      `;

      // 3. Récupérer les emails des abonnés
      const subscribers: { email: string }[] = await prisma.newsletterSubscriber.findMany({
        select: { email: true },
      });

    // Calculer le nombre de destinataires
    const recipientCount = subscribers.length;

      // Si aucun abonné, enregistrer quand même la campagne comme "envoyée" (à 0)
      if (!subscribers || subscribers.length === 0) {
        try {
          // Pour le cas 0 destinataire, recipientCount est 0
          console.log('[Admin Send API] Données envoyées à prisma.newsletterCampaign.create (0 destinataires):', { title, message, recipientCount: 0 }); // Log de vérification
          await prisma.newsletterCampaign.create({
            data: {
              title,
              message,
              scheduledAt: null, // Pas de planification
              sentAt: new Date(), // Marquer comme envoyé maintenant
              recipientCount: 0, // Ajout explicite
            },
          });
          console.log("Campagne enregistrée (0 destinataire).");
          return NextResponse.json({ message: 'Newsletter enregistrée (aucun abonné trouvé à qui envoyer).' }, { status: 200 });
        } catch (dbError) {
          console.error("Erreur lors de l'enregistrement de la campagne (0 destinataire):", dbError);
          return NextResponse.json({ error: "Erreur lors de l'enregistrement de la campagne." }, { status: 500 });
        }
      }

      const subscriberEmails = subscribers.map(sub => sub.email);

      // 5. Envoyer l'email via Resend
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: subscriberEmails,
        subject: title,
        html: htmlTemplate,
      });

      if (error) {
        console.error("Erreur lors de l'envoi via Resend:", error);
        return NextResponse.json({ error: "Erreur lors de l'envoi de l'email.", details: error.message }, { status: 500 });
      }

      console.log("Email envoyé avec succès via Resend:", data);

      // 6. Sauvegarder la campagne APRÈS l'envoi réussi
      if (data) {
        try {
          // Log avant la création pour l'envoi réussi
          await prisma.newsletterCampaign.create({
            data: {
              title,
              message,
              scheduledAt: null, // Pas de planification
              sentAt: new Date(), // Marquer comme envoyé maintenant
              recipientCount: recipientCount, // Ajout du comptage
            },
          });
          console.log("Newsletter envoyée immédiatement et enregistrée.");
        } catch (dbError) {
          console.error("Erreur lors de l'enregistrement de la campagne post-envoi:", dbError);
          // Logguer l'erreur BDD mais renvoyer succès pour l'email
        }
      }

      // 7. Renvoyer une réponse de succès
      return NextResponse.json({ message: `Newsletter envoyée avec succès à ${subscriberEmails.length} abonnés!`, resendData: data }, { status: 200 });
    }

  } catch (error) {
    console.error("Erreur globale dans la route /api/admin/newsletter/send:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Corps de la requête JSON invalide.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}