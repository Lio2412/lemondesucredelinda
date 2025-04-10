'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la locale française
import { CalendarIcon, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast'; // Restaurer chemin original
import { cn } from '@/lib/utils'; // Assurez-vous que cette fonction existe

// Schéma de validation Zod pour le formulaire d'article (restauré)
const articleFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères.' }),
  slug: z.string().min(3, { message: 'Le slug doit contenir au moins 3 caractères.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug invalide (lettres minuscules, chiffres, tirets).' }),
  tags: z.string().optional(), // Simple chaîne pour les tags séparés par des virgules pour l'instant
  excerpt: z.string().min(10, { message: "L'extrait doit contenir au moins 10 caractères." }).max(200, { message: "L'extrait ne doit pas dépasser 200 caractères." }),
  content: z.string().min(50, { message: 'Le contenu doit contenir au moins 50 caractères.' }), // Restauré min(50)
  publishedAt: z.date().optional().nullable(), // Rendre la date optionnelle et nullable
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')), // URL pour l'image, optionnelle
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>; // Exporter le type

// Props pour le composant ArticleForm (restaurées)
interface ArticleFormProps {
  initialData?: Partial<ArticleFormValues>;
  articleId?: string; // Ajouter l'ID pour le mode édition
  onSubmitSuccess?: () => void;
}

export function ArticleForm({ initialData, articleId, onSubmitSuccess }: ArticleFormProps) { // Props restaurées
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Ajouter l'état de soumission
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData || { // Utilisation de initialData restaurée
      title: '',
      slug: '',
      tags: '',
      excerpt: '',
      content: '',
      publishedAt: new Date(),
      imageUrl: '',
    },
  });

  // Fonction de soumission connectée à l'API
  // Fonction onSubmit restaurée pour gérer POST et PUT
  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    const method = articleId ? 'PUT' : 'POST'; // Logique conditionnelle restaurée
    const endpoint = articleId ? `/api/articles/${articleId}` : '/api/articles'; // Logique conditionnelle restaurée

    // Préparer le payload pour l'API (correspondant au modèle Prisma Article)
    // Note: Le payload pour PUT pourrait différer légèrement si l'API PUT gère plus de champs
    // Préparer le payload complet pour l'API (correspondant aux routes API mises à jour)
    const payload = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      // Transformer la chaîne de tags en tableau de strings
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
      // Envoyer la date au format ISO si elle existe, sinon null
      publishedAt: data.publishedAt instanceof Date ? data.publishedAt.toISOString() : null,
      imageUrl: data.imageUrl || null, // Envoyer l'URL ou null si vide
    };

    try {
      const response = await fetch(endpoint, {
        method: method, // Méthode dynamique restaurée
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Échec de la ${articleId ? 'mise à jour' : 'création'}`); // Message d'erreur dynamique restauré
      }

      // Afficher le toast uniquement en cas de mise à jour réussie
      if (articleId && response.ok) {
        toast({
          title: "Succès", // Simplifié le titre
          description: "✅ Article mis à jour avec succès !",
        });
      } else if (!articleId && response.ok) {
        // Garder un message pour la création si nécessaire
         toast({
          title: "Succès",
          description: "Article enregistré avec succès.",
        });
      }

      // Logique de redirection/callback restaurée
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push('/admin/articles');
        router.refresh();
      }

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur ❌",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        // variant: "destructive", // Si supporté
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour générer le slug à partir du titre (restaurée)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD") // Normaliser pour enlever les accents
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, '') // Enlever caractères non alphanumériques sauf espaces et tirets
      .trim()
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-'); // Remplacer tirets multiples par un seul
  };

  // Gestionnaire de changement de titre pour màj slug (restauré)
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue('title', title); // Mettre à jour la valeur du titre dans le formulaire
    const slug = generateSlug(title);
    form.setValue('slug', slug); // Mettre à jour le slug automatiquement
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Titre */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de votre article..." {...field} onChange={handleTitleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug (restauré) */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="titre-de-votre-article" {...field} />
              </FormControl>
              <FormDescription>
                Ceci est l'identifiant unique de l'article dans l'URL (généré automatiquement).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="tag1, tag2, tag3" {...field} />
              </FormControl>
              <FormDescription>
                Séparez les tags par des virgules.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extrait (restauré) */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extrait</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Un court résumé de votre article..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ce texte apparaîtra dans les listes d'articles (max 200 caractères).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contenu */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Rédigez le contenu principal de votre article ici..."
                  className="min-h-[200px]" // Hauteur minimale plus grande
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Vous pouvez utiliser la syntaxe Markdown simple.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date de publication (restauré) */}
        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de publication</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: fr }) // Utiliser la locale fr
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined} // Convertir null en undefined pour react-day-picker
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                    locale={fr} // Utiliser la locale fr dans le calendrier
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL (Optionnel) (restauré) */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image (Optionnel)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://exemple.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Lien vers l'image principale de l'article.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (articleId ? 'Mise à jour...' : 'Publication...') : (articleId ? '💾 Enregistrer les modifications' : 'Publier l’article')}
        </Button>
      </form>
    </Form>
  );
}