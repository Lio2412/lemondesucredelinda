import { NextResponse } from "next/server";
import { Resend } from "resend";

// Vérifier si la clé API Resend est définie
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("RESEND_API_KEY is not defined in environment variables.");
  // Retourner une erreur 500 si la clé n'est pas définie pour éviter les erreurs d'exécution
  // Ou gérer cela d'une autre manière appropriée (ex: logger et retourner une erreur spécifique)
  // Pour l'instant, on loggue et on continue, mais Resend échouera.
}

const resend = new Resend(resendApiKey);
const toEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || "Linda.rassegna@hotmail.be"; // Utiliser une variable d'env ou fallback

export async function POST(req: Request) {
  try {
    // Vérifier si la clé API est disponible avant de continuer
    if (!resendApiKey) {
      return NextResponse.json({ error: "Configuration error: Resend API Key is missing." }, { status: 500 });
    }

    const { name, email, subject, message, honeypot } = await req.json();

    // Vérification simple du honeypot
    if (honeypot) {
      console.log("Honeypot field filled, likely spam.");
      // Répondre avec succès pour ne pas alerter le bot, mais ne pas envoyer l'email
      return NextResponse.json({ success: true, message: "Form submitted successfully (honeypot)." });
    }

    // Validation basique des champs requis côté serveur
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Linda <contact@lemondesucredelinda.com>", // L'adresse 'from' doit être vérifiée dans Resend
      to: toEmail,
      replyTo: email, // Utiliser la bonne casse pour la propriété
      subject: `Contact Le Monde Sucré - ${subject}`, // Sujet plus spécifique
      html: `<p>Vous avez reçu un nouveau message via le formulaire de contact de Le Monde Sucré :</p>
             <p><strong>Nom :</strong> ${name}</p>
             <p><strong>Email :</strong> ${email}</p>
             <p><strong>Sujet :</strong> ${subject}</p>
             <p><strong>Message :</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`, // Remplacer les sauts de ligne par <br>
    });

    return NextResponse.json({ success: true, message: "Email sent successfully." });

  } catch (error) {
    console.error("Error sending email:", error);
    // Fournir un message d'erreur générique au client
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}