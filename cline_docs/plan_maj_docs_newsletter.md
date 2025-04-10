# Plan de Mise à Jour de la Documentation (Newsletter Recipient Count)

Ce plan détaille les étapes pour mettre à jour la documentation suite à l'ajout de la fonctionnalité d'affichage du nombre de destinataires dans l'historique des newsletters.

## 1. Modifier `cline_docs/activeContext.md`

*   **Action :** Mettre à jour la section "Changements récents" concernant la "Refonte Page Admin Newsletter" pour inclure explicitement :
    *   L'ajout du champ `recipientCount` au modèle `NewsletterCampaign`.
    *   La modification de l'API pour calculer et enregistrer ce champ.
    *   La mise à jour du frontend pour afficher ce champ.
*   **Action :** Mettre à jour la ligne "Travail actuel" pour indiquer : `Travail actuel : Finalisation de la mise à jour de la documentation suite à l'amélioration de l'historique des newsletters (ajout recipientCount).`
*   **But :** Refléter précisément l'achèvement de la fonctionnalité et l'état actuel du travail.

## 2. Modifier `cline_docs/progress.md`

*   **Action :** Ajouter une nouvelle sous-puce dans la section "Ce qui fonctionne :" -> "Fonctionnalité Newsletter" :
    ```markdown
    - Affichage du nombre de destinataires (`recipientCount`) dans l'historique des campagnes.
    ```
*   **But :** Documenter clairement que cette partie spécifique de la fonctionnalité est opérationnelle.

## 3. Modifier `cline_docs/systemPatterns.md`

*   **Action :** Ajouter une note après la description de la gestion des données Prisma ou créer une petite sous-section "Newsletter (Admin)" :
    ```markdown
    ### Newsletter (Admin)

    Le modèle Prisma `NewsletterCampaign` inclut un champ `recipientCount` (Integer) qui stocke le nombre de destinataires au moment de l'envoi. Ce dénombrement est effectué dans la route API `/api/send-newsletter` et enregistré avec la campagne pour un affichage efficace de l'historique sans nécessiter de recalculs complexes.
    ```
*   **But :** Expliquer le *pourquoi* et le *comment* du stockage de `recipientCount` pour référence future.

## 4. Modifier `README.md`

*   **Action 1 (Migrations Prisma) :** Dans la section "Lancement du Projet", juste avant l'étape 3 (`npx prisma migrate deploy`), ajouter une note :
    ```markdown
    **Note sur les Migrations Prisma :** Lors du développement, si vous modifiez le fichier `prisma/schema.prisma`, vous devez générer et appliquer une nouvelle migration en exécutant `npx prisma migrate dev --name <nom_descriptif_migration>`. La commande `npx prisma migrate deploy` est généralement utilisée pour appliquer les migrations existantes en production ou lors de la configuration initiale.
    ```
*   **Action 2 (Nouvelle Fonctionnalité) :** Dans la description de la section Admin (ligne 17), modifier la partie sur la page Newsletter :
    *   *Avant :* `...une page **Newsletter** (`/admin/newsletter`) **consolidée** (formulaire de création + historique des envois avec option "Renvoyer")...`
    *   *Après :* `...une page **Newsletter** (`/admin/newsletter`) **consolidée** (formulaire de création + historique des envois affichant le nombre de destinataires pour chaque campagne, avec option "Renvoyer")...`
*   **But :** Améliorer les instructions de développement et informer sur les capacités actuelles de l'application.

## Diagramme du Flux (Simplifié)

```mermaid
graph TD
    A[Début: MàJ Docs] --> B{Lire Fichiers Existants};
    B --> C[Analyser Contenu];
    C --> D[Plan: Modifier activeContext.md];
    C --> E[Plan: Modifier progress.md];
    C --> F[Plan: Modifier systemPatterns.md];
    C --> G[Plan: Modifier README.md];
    D & E & F & G --> H{Valider Plan};
    H -- Approuvé --> I[Implémenter Changements (Mode Code)];
    I --> J[Fin: Docs à Jour];