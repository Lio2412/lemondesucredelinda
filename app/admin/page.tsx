import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Cake, Pencil, FileText, Plus, BookOpen, Sparkles } from 'lucide-react';
import { getAllRecipes } from '@/lib/data/recipes'; // Importer les données
import { getAllCreations } from '@/lib/data/creations'; // Importer les données
import { getAllArticles } from '@/lib/data/articles'; // Importer les données
import { ContentItem } from '@/types'; // Importer le type combiné

// Suppression des mocks statiques, les données seront chargées dynamiquement

export default async function AdminDashboardPage() { // Rendre la page asynchrone
  // Charger les données
  const recipes = await getAllRecipes();
  const creations = await getAllCreations({ includeUnpublished: true }); // Inclure les non publiées pour le comptage admin
  const articles = await getAllArticles();

  // Calculer les totaux
  const recipeCount = recipes.length;
  const creationCount = creations.length;
  const articleCount = articles.length;

  // Préparer les derniers contenus
  const allContent: ContentItem[] = [
    ...recipes.map(r => ({ ...r, type: 'recipe' as const })),
    ...creations.map(c => ({ ...c, type: 'creation' as const })),
    ...articles.map(a => ({ ...a, type: 'article' as const })),
  ];

  const latestContent = allContent
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Trier par date décroissante
    .slice(0, 5); // Prendre les 5 plus récents

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>

        {/* Quick Summary Section */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Link href="/admin/recipes" className="hover:underline">
                  Recettes
                </Link>
              </CardTitle>
              <Cake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipeCount}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/recipes" className="hover:underline">
                  Gérer les recettes
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créations</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creationCount}</div>
              <p className="text-xs text-muted-foreground">Nombre total de créations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articleCount}</div>
              <p className="text-xs text-muted-foreground">Nombre total d'articles</p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions Section */}
        <section className="grid gap-4 md:grid-cols-3">
           <Button asChild>
             <Link href="/admin/recipes/new">
               <Plus className="mr-2 h-4 w-4" /> Ajouter une recette
             </Link>
           </Button>
           <Button asChild>
             <Link href="/admin/creations/new">
               <Plus className="mr-2 h-4 w-4" /> Ajouter une création
             </Link>
           </Button>
           <Button asChild>
             <Link href="/admin/articles/new">
               <Plus className="mr-2 h-4 w-4" /> Nouvel article
             </Link>
           </Button>
        </section>

        {/* Recent Content Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Derniers contenus ajoutés</CardTitle>
              <CardDescription>
                Aperçu des dernières publications sur le blog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestContent.map((item) => (
                    <TableRow key={`${item.type}-${item.id}`}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline" // Utiliser une variante neutre et surcharger les couleurs
                          className={
                            item.type === 'recipe' ? 'bg-pink-100 text-pink-700 border-pink-200' :
                            item.type === 'creation' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                            item.type === 'article' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            '' // Fallback ou classe par défaut si nécessaire
                          }
                        >
                          {item.type === 'recipe' ? 'Recette' : item.type === 'creation' ? 'Création' : 'Article'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Button aria-haspopup="true" size="icon" variant="ghost" asChild>
                          {/* Ajustement pour le pluriel correct dans l'URL */}
                          <Link href={`/admin/${item.type === 'creation' ? 'creations' : item.type + 's'}/${item.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}