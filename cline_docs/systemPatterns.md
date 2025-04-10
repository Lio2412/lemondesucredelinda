# Modèles Système

Le frontend est construit avec Next.js et Tailwind CSS. Nous utilisons une architecture basée sur les composants avec un mélange de Server Components (par défaut, pour le rendu serveur et la récupération de données) et de Client Components (`'use client'`) pour l'interactivité.

L'authentification pour la section `/admin` est gérée par :
- Un **middleware Next.js** (`middleware.ts`) qui intercepte les requêtes et vérifie un cookie d'authentification.
- Un **React Context Provider** (`AuthProvider.tsx`) qui gère l'état de connexion côté client et manipule le cookie.

La gestion des données pour les **Recettes**, **Créations**, et **Articles** est maintenant assurée par **Prisma** connecté à une base de données PostgreSQL (Supabase), via une instance partagée dans `lib/prisma.ts`. Les données sont récupérées dans les Server Components (pages) et les actions CRUD sont gérées via des API Routes dédiées (`/api/[type]/[id]`). Les **Recettes** utilisent une structure relationnelle avec des modèles `Ingredient` et `RecipeStep` séparés. L'authentification reste simulée via cookie. Le stockage des images est géré via Supabase Storage (bucket public "images").

Le flux d'inscription à la **Newsletter** fonctionne comme suit :
- Le formulaire frontend (`components/layout/NewsletterForm.tsx`) soumet l'adresse email à l'API Route `/api/newsletter`.
- L'API Route (`app/api/newsletter/route.ts`) :
    - Valide l'adresse email.
    - Vérifie si l'abonné existe déjà dans la base de données Supabase via Prisma (modèle `NewsletterSubscriber`). Si non, le crée.
    - Envoie un email de bienvenue à l'abonné via **Resend**.

### Newsletter (Admin)

Le modèle Prisma `NewsletterCampaign` inclut un champ `recipientCount` (Integer) qui stocke le nombre de destinataires au moment de l'envoi. Ce dénombrement est effectué dans la route API `/api/send-newsletter` et enregistré avec la campagne pour un affichage efficace de l'historique sans nécessiter de recalculs complexes.

## Gestion des Emails (Resend)

L'envoi d'emails transactionnels (formulaire de contact, confirmation newsletter) est géré via le service **Resend**. 

Pour professionnaliser la communication et simplifier la gestion des réponses pour Linda, des adresses d'expéditeur distinctes sont utilisées :
- `newsletter@lemondesucredelinda.com` pour les emails liés à la newsletter.
- `contact@lemondesucredelinda.com` pour les emails envoyés depuis le formulaire de contact.

Le formulaire de contact utilise également le champ `replyTo` avec l'adresse email fournie par l'utilisateur, permettant à Linda de répondre directement depuis sa boîte de réception.