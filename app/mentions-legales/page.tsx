// [MEMORY BANK: ACTIVE]
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Chemin d'import corrigé avec alias

export const generateMetadata = (): Metadata => ({
  title: "Mentions légales - Le Monde Sucré de Linda",
  description: "Mentions légales du site Le Monde Sucré de Linda, blog pâtisserie personnel.",
  // Pas besoin de spécifier 'robots: index, follow' car c'est le comportement par défaut
});

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 pt-28 pb-12">
      <article className="prose dark:prose-invert max-w-none"> {/* Applique prose ici */}
        <h1 className="text-3xl font-bold mb-8 text-center">Mentions Légales</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Éditeur du site</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Le Monde Sucré de Linda</strong></p>
            <p>Site personnel dédié à la pâtisserie française.</p>
            <p><strong>Responsable de la publication :</strong> Linda Rassegna</p>
            <p><strong>Email :</strong> contact@lemondesucredelinda.com</p>
            <p><strong>Nom de domaine :</strong> www.lemondesucredelinda.com</p>
            <p><strong>Hébergeur :</strong> OVH</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tous les contenus présents sur ce site (textes, recettes, images, visuels, logo, etc.) sont la propriété exclusive de Le Monde Sucré de Linda, sauf mention contraire.</p>
            <p>Toute reproduction, diffusion ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Responsabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Les informations sont données à titre indicatif.</p>
            <p>Le Monde Sucré de Linda ne saurait être tenue responsable d’une mauvaise utilisation des recettes proposées.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ce site peut utiliser des cookies à des fins statistiques et de fonctionnement.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pour toute demande :</p>
            <p>contact@lemondesucredelinda.com</p>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}