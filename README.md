# Le Monde Sucré de Linda - Refonte Design Next.js

Ce projet est une refonte du design visuel du site original "Le Monde Sucré de Linda". L'objectif était de recréer l'interface utilisateur (UI) et l'expérience utilisateur (UX) des pages principales dans un nouveau projet basé sur Next.js 14+ avec le App Router.

**Important :** Ce projet est une refonte fonctionnelle utilisant Next.js 14+ (App Router), Prisma, et Supabase. Les sections **Recettes**, **Créations** et **Articles** (admin et publiques) sont connectées à la base de données. La section **Recettes** a été entièrement refactorisée pour utiliser une structure de données relationnelle détaillée (ingrédients, étapes) et gère l'upload d'images vers Supabase Storage. Une **authentification simple (mock)** est toujours en place pour la section `/admin`. Le thème visuel est configuré en **mode clair**.

## Pages Recréées

Les pages suivantes ont été recréées visuellement en utilisant Tailwind CSS et les composants UI de base (inspirés de Shadcn/ui) :

*   **Accueil (`/`)**: Présentation générale, catégories, recettes en vedette, **fonctionnalité newsletter** (permet l'inscription via un formulaire et utilise Resend pour l'envoi d'emails).
*   **Recettes - Liste (`/recettes`)**: Affichage en grille des recettes récupérées depuis la BDD, avec filtres par catégorie (mock) et barre de recherche (logique côté client). Utilise le `slug` pour les liens.
*   **Recettes - Détail (`/recettes/[slug]`)**: Affichage détaillé d'une recette (image, description, temps, difficulté, ingrédients structurés, étapes structurées) avec intégration du **Mode Cuisine** fonctionnel utilisant les données réelles.
*   **Blog - Liste (`/blog`)**: Affichage des articles de blog récupérés depuis la BDD, avec filtres par tag, recherche et pagination (logique côté client).
*   **Blog - Détail (`/blog/[slug]`)**: Affichage d'un article de blog complet (image, métadonnées, contenu formaté avec `prose`). C'est maintenant un **Server Component** récupérant les données réelles depuis Prisma et utilisant un **Client Component** (`AnimatedArticleTitle`) pour l'animation du titre.
*   **Contact (`/contact`)**: Informations de contact et formulaire **fonctionnel** (envoi d'email via Resend, notifications Sonner, honeypot).
*   **Admin (Mock Auth) (`/admin`)**: Interface d'administration simplifiée **protégée par une authentification basique** (identifiants : `admin@lemonde-sucre.fr` / `demo123`). Comprend une page de connexion (`/login`), un layout dédié, un tableau de bord **entièrement connecté aux données Prisma** (compteurs, **section dynamique "Derniers contenus ajoutés"**), la gestion des **Recettes** (liste/création/modification/suppression - **Refonte complète avec structure détaillée et gestion images via Supabase, avec gestion de la publication (visibilité publique)**), **Créations** (liste/création/modification/suppression - **Gestion images via Supabase, avec gestion de la publication (visibilité publique)**), **Articles** (liste/création/modification/suppression - **Connecté BDD Prisma, gère slug, excerpt, image, publishedAt ; le formulaire d'édition charge correctement toutes les données existantes**), une page **Newsletter** (`/admin/newsletter`) **consolidée** (formulaire de création + historique des envois affichant le nombre de destinataires pour chaque campagne, avec option "Renvoyer"), et une page **Analytics** (`/admin/analytics`) **entièrement dynamique et connectée aux données Prisma** (chiffres clés, tableau des derniers contenus, graphique des publications par mois, graphique de répartition des types). La barre latérale a été nettoyée et réorganisée. L'accès au Dashboard et la déconnexion se font via un **menu déroulant discret** dans le Header pour les admins connectés.
*   **Page 404 (`/not-found`)**: Page d'erreur personnalisée.
*   Pages légales (Mentions Légales, Politique de Confidentialité) accessibles depuis le pied de page.

Le design du **Header** a été ajusté pour une disposition équilibrée (Logo gauche, Navigation centre, Actions droite), intègre un menu déroulant pour les actions administrateur sur desktop, et utilise désormais un **menu mobile responsive (`Sheet`)** pour les écrans plus petits. Le **Footer** correspond au thème clair souhaité.

## Structure du Projet

Le projet suit les conventions de Next.js App Router :

```
nouveau-projet-linda/
├── app/                     # Pages et layouts (App Router)
│   ├── (default)/           # Pages principales (Accueil, Contact, etc.)
│   │   ├── page.tsx         # Accueil
│   │   ├── contact/page.tsx # Contact
│   │   └── ...
│   ├── blog/                # Section Blog
│   │   ├── page.tsx         # Liste des articles
│   │   └── [slug]/page.tsx  # Détail d'un article
│   ├── recettes/            # Section Recettes
│   │   ├── page.tsx         # Liste des recettes
│   │   └── [slug]/          # Détail d'une recette
│   │       ├── page.tsx
│   │       └── default.tsx    # Pour résoudre avertissement route parallèle
│   ├── admin/               # Section Admin (Mock)
│   │   ├── layout.tsx       # Layout spécifique Admin
│   │   ├── page.tsx         # Tableau de bord Admin
│   │   ├── login/page.tsx   # Page de connexion Admin
│   │   ├── recipes/         # Gestion des recettes
│   │   │   ├── page.tsx         # Liste des recettes
│   │   │   ├── new/page.tsx     # Création de recette
│   │   │   └── [id]/edit/page.tsx # Modification de recette
│   │   ├── creations/       # Gestion des créations
│   │   │   ├── page.tsx         # Liste des créations
│   │   │   ├── new/page.tsx     # Création de création
│   │   │   └── [id]/edit/page.tsx # Modification de création
│   │   ├── articles/        # Gestion des articles
│   │   │   ├── page.tsx         # Liste des articles
│   │   │   ├── new/page.tsx     # Création d'article
│   │   │   └── [id]/edit/page.tsx # Modification d'article
│   │   └── analytics/page.tsx # Page Analytics
│   ├── layout.tsx           # Layout racine (Header, Footer, ThemeProvider)
│   └── not-found.tsx        # Page 404 personnalisée
├── components/              # Composants React réutilisables
│   ├── admin/               # Composants spécifiques à l'admin (RecipeForm, CreationForm, ArticleForm, RecipesTable, etc.)
│   ├── layout/              # Composants de mise en page (Header, Footer)
│   ├── providers/           # Providers React (ThemeProvider, NextAuthProvider)
│   ├── recipe/              # Composants liés aux recettes (RecipeCard, CookingMode, CookingModeWrapper)
│   └── ui/                  # Composants UI de base (Button, Card, Input, Select, Avatar etc.)
├── lib/                     # Fonctions utilitaires et accès données
│   ├── utils.ts
│   ├── data/                # Fonctions d'accès aux données (utilisent Prisma)
│   ├── prisma.ts            # Instance Prisma partagée
│   └── supabase.ts          # Clients Supabase (standard et admin)
├── public/                  # Fichiers statiques
│   └── images/              # Images (avatars, recettes, icônes) copiées de l'original
├── styles/                  # Fichiers de style
│   └── globals.css          # Styles globaux, directives Tailwind, variables CSS
├── middleware.ts            # Middleware Next.js (protection routes admin)
├── cline_docs/              # Documentation interne (Memory Bank)
├── prisma/                  # Configuration Prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/          # Fichiers de migration SQL générés
├── api/                     # API Routes
│   ├── recipes/             # CRUD Recettes
│   ├── creations/           # CRUD Créations
│   ├── articles/            # CRUD Articles
│   └── contact/             # Envoi formulaire de contact
├── frontend/                # Code source du projet original (pour référence)
├── node_modules/            # Dépendances du projet
├── .env.local               # Variables d'environnement locales (IMPORTANT: à ne pas commiter)
├── .eslintrc.json           # Configuration ESLint
├── .gitignore               # Fichiers ignorés par Git
├── next.config.js           # Configuration Next.js (images externes autorisées: unsplash, supabase, freepik)
├── package.json             # Dépendances et scripts
├── postcss.config.js        # Configuration PostCSS
├── tailwind.config.js       # Configuration Tailwind CSS (avec plugin typography)
├── tsconfig.json            # Configuration TypeScript principale
└── tsconfig.seed.json       # Configuration TypeScript pour la compilation du script de seed
```
## Changelog

### 12/04/2025
- **Forçage du SSR (Server-Side Rendering) sur les pages `/creations` et `/creations/[id]`**  
  Les pages `app/creations/page.tsx` et `app/creations/[id]/page.tsx` utilisent désormais le SSR forcé afin de garantir la propagation instantanée des modifications sur le site public (par exemple lors de la création, modification ou suppression d’une création).  
  _Modification poussée sur la branche principale le 12/04/2025 (voir Git pour le commit exact)._

## Dépendances Clés Ajoutées

Au cours du développement, les dépendances suivantes ont été ajoutées pour assurer le bon fonctionnement des composants UI et des fonctionnalités :

*   `@tailwindcss/typography`: Pour les styles `prose` utilisés dans les articles de blog.
*   `@radix-ui/*`: Composants UI primitifs utilisés par shadcn/ui (Select, Avatar, Popover, Toast, AlertDialog, DropdownMenu, etc.).
*   `react-hook-form`, `@hookform/resolvers`, `zod`: Pour la gestion et la validation des formulaires (utilisé dans l'admin).
*   `lucide-react`: Pour les icônes.
*   `date-fns`, `react-day-picker`: Pour le composant `Calendar` et `DatePicker`.
*   `recharts`: Pour l'affichage des graphiques dans la page Analytics.
*   `js-cookie`, `@types/js-cookie`: Pour la gestion des cookies côté client (utilisé par l'authentification mock).
*   `@prisma/client`, `prisma`: Pour l'interaction avec la base de données.
*   `@next-auth/prisma-adapter`: Pour lier NextAuth à Prisma (bien que NextAuth ne soit pas pleinement utilisé actuellement).
*   `bcryptjs`, `@types/bcryptjs`: Pour le hachage des mots de passe (utilisé dans le script de seed).
*   `ts-node`, `dotenv-cli`: Pour exécuter le script de seeding Prisma.
*   `uuid`, `@types/uuid`: Pour générer des noms de fichiers uniques pour les images uploadées.
*   `npm-run-all`: Pour exécuter séquentiellement les scripts de compilation et d'exécution du seeding.
*   `framer-motion`: Pour les animations (Mode Cuisine, titre de page).
*   `next-themes`: Pour la gestion du thème (bien que forcé en clair actuellement).
*   `next-auth`: Pour la structure d'authentification (utilisée en mode mock).
*   `@supabase/supabase-js`: Pour interagir avec Supabase (client et Storage).
*   `resend`: Pour l'envoi d'emails via l'API Resend (formulaire de contact).
*   `sonner`: Pour afficher des notifications toast (formulaire de contact).


## Configuration de l'Envoi d'Emails (Resend)

L'envoi d'emails transactionnels (formulaire de contact, inscription newsletter) est géré via le service Resend.

*   **Clé API :** La connexion à Resend nécessite une clé API qui doit être configurée dans le fichier `.env.local` via la variable d'environnement `RESEND_API_KEY`. Voir la section "Lancement du Projet" pour plus de détails.
*   **Adresses d'expédition :**
    *   **Newsletter :** Les emails d'inscription à la newsletter sont envoyés depuis `"Le Monde Sucré <newsletter@lemondesucredelinda.com>"`.
    *   **Formulaire de contact :** Les emails envoyés via le formulaire de contact utilisent l'adresse `"Linda <contact@lemondesucredelinda.com>"`.
*   **Réponse directe (Contact) :** Pour faciliter la réponse aux messages du formulaire de contact, le champ `reply_to` de l'email est automatiquement défini avec l'adresse email fournie par l'utilisateur dans le formulaire.

## Lancement du Projet

1.  **Variables d'environnement :** Créez un fichier `.env.local` à la racine et ajoutez votre URL de connexion directe à la base de données Supabase PostgreSQL :
    ```
    # Note: Prisma utilise DATABASE_URL pour se connecter à la base de données.
    DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@[ID_PROJET_SUPABASE].db.supabase.co:5432/postgres"
    # Variables pour Supabase Auth et Storage
    NEXT_PUBLIC_SUPABASE_URL="https://[ID_PROJET_SUPABASE].supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[VOTRE_CLE_ANON_SUPABASE]"
    SUPABASE_SERVICE_ROLE="[VOTRE_CLE_SERVICE_ROLE_SUPABASE]" # Nécessaire pour l'upload/suppression d'images côté serveur
    # Variable pour Resend (Emails)
    RESEND_API_KEY="[VOTRE_CLE_API_RESEND]" # Nécessaire pour l'envoi d'emails (formulaire de contact et newsletter)
    ```
2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
**Note sur les Migrations Prisma :** Lors du développement, si vous modifiez le fichier `prisma/schema.prisma`, vous devez générer et appliquer une nouvelle migration en exécutant `npx prisma migrate dev --name <nom_descriptif_migration>`. La commande `npx prisma migrate deploy` est généralement utilisée pour appliquer les migrations existantes en production ou lors de la configuration initiale.

3.  **Appliquer les migrations Prisma :** (Normalement fait par `prisma migrate reset` ou `dev`, mais pour être sûr)
    ```bash
    npx prisma migrate deploy
    ```
4.  **Exécuter le script de seeding :** (Pour créer l'utilisateur admin et les données initiales)
    ```bash
    npx prisma db seed
    ```
5.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
6.  Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000).

Vous devriez voir la page d'accueil et pouvoir naviguer vers les différentes sections recréées, avec le design et les fonctionnalités de base implémentés.