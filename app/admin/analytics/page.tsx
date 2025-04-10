// Retrait de 'use client' pour Server Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Imports Recharts déplacés dans les composants clients dédiés
import { Utensils, Sparkles, BookOpen, TrendingUp, Clock, List } from 'lucide-react'; // Ajout List pour la table
import { getTotalCounts, getRecentContents, getMonthlyContentData } from '@/lib/data/analytics';
// Importer les futurs composants graphiques et la table
import MonthlyContentChart from '@/components/admin/analytics/MonthlyContentChart';
import ContentTypePieChart from '@/components/admin/analytics/ContentTypePieChart';
import RecentContentTable from '@/components/admin/analytics/RecentContentTable';
// Données mockées supprimées, seront récupérées via Prisma

export default async function AnalyticsPage() {
  // Récupération des données côté serveur
  const totalCounts = await getTotalCounts();
  const recentContents = await getRecentContents();
  const monthlyData = await getMonthlyContentData();

  // Préparation des données pour le PieChart (basé sur les comptes totaux)
  const contentTypeData = [
    { name: 'Recettes', value: totalCounts.recipes },
    { name: 'Créations', value: totalCounts.creations },
    { name: 'Articles', value: totalCounts.articles },
  ];

  // Données pour les cartes de chiffres clés (à remplacer par des vraies stats si besoin)
  const keyStats = {
    mostViewedRecipe: 'N/A', // À implémenter si nécessaire
    averageMonthlyPosts: 'N/A', // À calculer si nécessaire
    lastUpdate: recentContents.length > 0
      ? new Date(recentContents[0].createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Aucune publication',
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Statistiques du site</h1>

      {/* Section Chiffres Clés (Utilise les données réelles) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
             <Utensils className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalCounts.recipes}</div>
             {/* <p className="text-xs text-muted-foreground">+2 depuis hier</p> */}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Créations</CardTitle>
             <Sparkles className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalCounts.creations}</div>
             {/* <p className="text-xs text-muted-foreground">+5 depuis hier</p> */}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
             <BookOpen className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalCounts.articles}</div>
             {/* <p className="text-xs text-muted-foreground">+1 depuis hier</p> */}
           </CardContent>
         </Card>
       </section>

      {/* Section Graphiques (Utilisera les composants Client dédiés) */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         {/* Graphique Linéaire (Composant Client) */}
         <Card className="lg:col-span-4">
           <CardHeader>
             <CardTitle>Publications par mois</CardTitle>
             <CardDescription>Évolution mensuelle des ajouts de contenu.</CardDescription>
           </CardHeader>
           <CardContent className="pl-2">
             <MonthlyContentChart data={monthlyData} />
             {/* <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
               Graphique à venir... */}
             {/* </div> */}
           </CardContent>
         </Card>

         {/* Graphique Camembert (Composant Client) */}
         <Card className="lg:col-span-3">
           <CardHeader>
             <CardTitle>Répartition du contenu</CardTitle>
             <CardDescription>Distribution totale des types de contenu.</CardDescription>
           </CardHeader>
           <CardContent>
              <ContentTypePieChart data={contentTypeData} />
              {/* <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
               Graphique à venir... */}
             {/* </div> */}
           </CardContent>
         </Card>
       </section>

      {/* Section Derniers Contenus Ajoutés (Utilisera un composant Client dédié) */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Derniers contenus ajoutés</CardTitle>
            <CardDescription>Les 5 publications les plus récentes tous types confondus.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentContentTable data={recentContents} />
             {/* <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
               Tableau à venir... */}
             {/* </div> */}
          </CardContent>
        </Card>
      </section>

      {/* Section Stats Clés Additionnelles (Utilise les données calculées/mockées) */}
      {/* Note: Ces stats nécessiteraient des requêtes plus complexes ou un suivi externe */}
      <section className="grid gap-4 md:grid-cols-3">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Recette la + vue</CardTitle>
             <Utensils className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-lg font-semibold">{keyStats.mostViewedRecipe}</div>
             <p className="text-xs text-muted-foreground">Donnée non disponible</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Moyenne d'ajouts / mois</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{keyStats.averageMonthlyPosts}</div>
             <p className="text-xs text-muted-foreground">Donnée non disponible</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Dernière publication</CardTitle>
             <Clock className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-lg font-semibold">{keyStats.lastUpdate}</div>
             <p className="text-xs text-muted-foreground">Basé sur les 5 derniers contenus</p>
           </CardContent>
         </Card>
       </section>
    </div>
  );
}