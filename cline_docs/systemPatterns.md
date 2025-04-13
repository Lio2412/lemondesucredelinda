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

---

## Stratégie SSR sur les pages de créations

Pour garantir la fraîcheur des données et la propagation instantanée de toute modification (ajout, édition, suppression) sur le site public, les pages `app/creations/page.tsx` et `app/creations/[id]/page.tsx` forcent le Server Side Rendering (SSR).
Ce choix désactive le cache ISR/SSG pour ces pages, assurant que chaque requête affiche l’état le plus à jour des créations, sans délai de propagation.
Cette stratégie a été adoptée suite à des besoins de cohérence immédiate entre l’interface d’administration et le site public.


## Pattern de Publication (Créations & Recettes)

Pour les modèles `Creation` et `Recipe`, la visibilité publique est contrôlée par un champ booléen `published` dans le schéma Prisma.

- **Accès aux Données :** Les fonctions d'accès aux données (`lib/data/creations.ts`, `lib/data/recipes.ts`) filtrent les résultats pour les pages publiques (`/creations`, `/recettes`, etc.), ne retournant que les éléments où `published` est `true`. Les pages d'administration (`/admin/*`) récupèrent tous les éléments, quel que soit leur statut de publication.
- **Interface Admin :** Les formulaires d'administration (`CreationForm.tsx`, `RecipeForm.tsx`) incluent un interrupteur (Switch) permettant à l'administrateur de définir l'état `published`.
- **API :** Les routes API correspondantes (POST pour la création, PUT pour la mise à jour) ont été modifiées pour accepter et enregistrer la valeur du champ `published`.
- **Cache :** Pour assurer que les changements de statut de publication soient immédiatement visibles, le cache est explicitement désactivé (`revalidate = 0`) sur les pages publiques listant ou affichant les Créations et Recettes.

**Différence avec les Articles :** Ce pattern diffère de celui utilisé pour les `Article`, qui utilisent un champ `publishedAt` (DateTime) pour déterminer la visibilité (un article est considéré comme publié si `publishedAt` est défini et est dans le passé).