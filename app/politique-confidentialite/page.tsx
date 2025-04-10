import React from 'react';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => ({
  title: "Politique de confidentialité - Le Monde Sucré de Linda",
  description: "Politique de confidentialité du site Le Monde Sucré de Linda. Gestion des données personnelles et cookies.",
  // Pas besoin de spécifier 'robots: index, follow' car c'est le comportement par défaut
});

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 pt-28 pb-12">
      <article className="prose dark:prose-invert max-w-none"> {/* Applique prose pour le style */}
        <h1 className="text-3xl font-bold mb-8 text-center">Politique de confidentialité</h1>

        <section className="mb-6">
          <h2>Données collectées</h2>
          <p>Lors de votre navigation, nous pouvons collecter :</p>
          <ul>
            <li>Votre adresse email (via le formulaire de contact ou l'inscription à la newsletter)</li>
            <li>Le contenu des messages que vous nous envoyez</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2>Utilisation des données</h2>
          <p>Les données collectées sont utilisées exclusivement pour les finalités suivantes :</p>
          <ul>
            <li>Vous répondre lorsque vous nous contactez</li>
            <li>Vous envoyer notre newsletter, si vous y êtes inscrit·e</li>
          </ul>
          <p>Aucune donnée personnelle n’est vendue, cédée ou partagée avec des tiers à des fins commerciales.</p>
        </section>

        <section className="mb-6">
          <h2>Stockage et Sécurité</h2>
          <p>Les données que vous nous confiez sont stockées de manière sécurisée. Nous utilisons les services de Supabase pour l'hébergement et la gestion de certaines données, en appliquant les mesures de sécurité appropriées.</p>
        </section>

        <section className="mb-6">
          <h2>Vos droits</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul>
            <li>Droit d'accès : Vous pouvez demander à consulter les données que nous détenons sur vous.</li>
            <li>Droit de rectification : Vous pouvez demander la correction de données inexactes.</li>
            <li>Droit à l'effacement ('droit à l'oubli') : Vous pouvez demander la suppression de vos données.</li>
            <li>Droit de retirer votre consentement : Vous pouvez vous désabonner de notre newsletter à tout moment via le lien de désinscription présent dans chaque email.</li>
          </ul>
          <p>Pour exercer ces droits ou pour toute question concernant vos données, veuillez nous contacter à l'adresse suivante :</p>
          <p>contact@lemondesucredelinda.com</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement ainsi que des cookies analytiques anonymes pour mesurer l'audience et améliorer l'expérience utilisateur. Vous pouvez gérer vos préférences concernant les cookies via les paramètres de votre navigateur.</p>
        </section>
      </article>
    </main>
  );
}