import { prisma } from "@/lib/prisma"; // Utilisation de l'alias @/
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error("RESEND_API_KEY is not set in environment variables.");
  // Tu peux choisir de lancer une erreur ou de continuer avec une instance non fonctionnelle
  // throw new Error("RESEND_API_KEY is not set");
}

// Initialise Resend seulement si la clé API existe
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Vérifie si l'email existe déjà
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // Retourne un succès même si déjà abonné pour ne pas révéler d'informations
      // Ou retourne un message spécifique si tu préfères
      return NextResponse.json({ message: "Déjà abonné" }, { status: 200 });
    }

    // Crée le nouvel abonné
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Envoi de l'email de bienvenue via Resend, seulement si Resend est initialisé
    if (resend) {
      try {
         await resend.emails.send({
          from: "Le Monde Sucré <newsletter@lemondesucredelinda.com>",
          to: email,
          subject: "Bienvenue dans la Newsletter du Monde Sucré ✨",
          html: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Arial', sans-serif; background: #fff7f9; color: #2d2d2d; padding: 32px;">
              <tr>
                <td align="center">
                  <h1 style="font-size: 28px; color: #e91e63;">Le Monde Sucré de Linda</h1>
                  <p style="font-size: 18px;">🧁 Votre dose de douceur & de créativité !</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 24px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  <h2 style="color: #333;">Bienvenue dans la newsletter !</h2>
                  <p style="font-size: 16px; line-height: 1.6;">
                    Bonjour gourmand(e),<br><br>

                    Merci pour votre inscription à <strong>“Le Monde Sucré de Linda”</strong> 🍰<br>
                    Vous recevrez bientôt des recettes exclusives, des astuces de pâtisserie et une bonne dose d’inspiration sucrée ✨

                    <br><br>
                    🍬 <strong>Astuce du jour :</strong> Pour des meringues parfaites, ajoute une pointe de vinaigre blanc à tes blancs montés !

                    <br><br>
                    À très vite pour de nouvelles douceurs !<br><br>
                    — Linda 💕
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top: 32px; font-size: 12px; color: #888;">
                  Vous recevez cet email car vous êtes inscrit à la newsletter du Monde Sucré.<br>
                  <a href="#" style="color: #e91e63;">Se désabonner</a>
                </td>
              </tr>
            </table>
          `,
        });
      } catch (emailError) {
         console.error("Erreur lors de l'envoi de l'email Resend:", emailError);
         // Décide si l'échec de l'email doit annuler l'opération ou juste être loggué
         // Ici, on continue même si l'email échoue, car l'abonné est en BDD
      }
    } else {
      console.warn("Resend n'est pas configuré (RESEND_API_KEY manquante), l'email de bienvenue n'a pas été envoyé.");
    }


    return NextResponse.json({ success: true }, { status: 201 }); // Status 201 pour création réussie

  } catch (error) {
    console.error("Erreur dans l'API Newsletter:", error);
    // Log l'erreur côté serveur pour le débogage
    // Retourne une erreur générique au client
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}