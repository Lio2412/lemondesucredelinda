'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"; // Restaurer chemin original
import Image from 'next/image'; // Pour la preview
import { useQueryClient } from '@tanstack/react-query'; // Importation ajoutée

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
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour le format de date français
import { cn } from '@/lib/utils';

// Schéma de validation Zod (restauré pour POST/PUT)
const formSchema = z.object({
  title: z.string().min(3, { // Restauré min(3)
    message: 'Le titre doit contenir au moins 3 caractères.',
  }),
  description: z.string().optional(),
  // Restauré pour accepter URL (string) ou File
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.any()),
  // Champ date restauré
  creationDate: z.date({
    required_error: 'Une date de création est requise.',
  }),
});

type CreationFormValues = z.infer<typeof formSchema>;

// Props restaurées pour gérer création et édition
interface CreationFormProps {
  initialData?: Partial<CreationFormValues>; // Restauré
  creationId?: string; // Restauré
  onSubmitSuccess?: () => void; // Restauré
}

export function CreationForm({ initialData, creationId, onSubmitSuccess }: CreationFormProps) { // Props restaurées
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Client React Query
  // State pour imagePreview restauré
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.imageUrl === 'string' ? initialData.imageUrl : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreationFormValues>({
    resolver: zodResolver(formSchema),
    // Valeurs par défaut restaurées utilisant initialData
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || undefined, // Restauré pour type file/string
      creationDate: initialData?.creationDate || new Date(), // Restauré
    },
  });

  // Gestionnaire de changement d'image restauré
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('imageUrl', file); // Stocker l'objet File
    } else {
      setImagePreview(null);
      form.setValue('imageUrl', undefined);
    }
  };

  // Fonction onSubmit restaurée pour gérer POST et PUT
  const onSubmit = async (values: CreationFormValues) => {
    setIsSubmitting(true);
    let response: Response;
    const method = creationId ? 'PUT' : 'POST'; // Logique conditionnelle restaurée
    const endpoint = creationId ? `/api/creations/${creationId}` : '/api/creations'; // Logique conditionnelle restaurée

    try {
      if (method === 'PUT') {
        // Si une nouvelle image est sélectionnée (c'est un File), envoyer FormData
        if (values.imageUrl instanceof File) {
          const formData = new FormData();
          formData.append('title', values.title);
          formData.append('description', values.description || "");
          formData.append('image', values.imageUrl, values.imageUrl.name);
          // Note: La date n'est pas envoyée ici, l'API PUT devra l'ignorer ou la gérer si nécessaire

          response = await fetch(endpoint, {
            method: 'PUT',
            body: formData, // Envoyer FormData
          });
        } else {
          // Sinon (pas de nouvelle image), envoyer JSON sans l'image
          const payload = {
            title: values.title,
            description: values.description,
            // Ne pas inclure 'image' ici pour ne pas écraser l'existante par erreur
          };
          response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }

      } else { // POST
        // Logique POST restaurée (envoi FormData)
        // Note: L'API POST /api/creations attend bien FormData pour l'upload initial.
        // Bloc de code formData dupliqué supprimé.
        // Logique POST restaurée et adaptée pour envoyer FormData
        const formData = new FormData();
        formData.append('title', values.title);
        // Assurer que la description est envoyée, même si vide (car requise par Prisma)
        formData.append('description', values.description || "");

        // Ajouter le fichier image s'il existe et est un objet File
        if (values.imageUrl instanceof File) {
          formData.append('image', values.imageUrl, values.imageUrl.name);
        }
        // Si imageUrl est une string (URL), l'API actuelle ne la gère pas via FormData.
        // L'utilisateur doit utiliser le champ 'Choisir une image' pour uploader.

        response = await fetch(endpoint, {
          method: 'POST',
          body: formData, // Envoyer FormData (pas de header Content-Type nécessaire, le navigateur le définit)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue lors de la requête.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Succès (commun aux deux méthodes)
      const resultData = await response.json(); // Récupérer la réponse (optionnel)

      // Afficher le toast uniquement en cas de mise à jour réussie
      if (creationId && response.ok) {
        toast({
          title: "Succès", // Simplifié le titre
          description: "✅ Création mise à jour avec succès !",
        });
        // Invalider les caches React Query
        queryClient.invalidateQueries({ queryKey: ['creation', creationId] });
        queryClient.invalidateQueries({ queryKey: ['creations'] });
      } else if (!creationId && response.ok) {
        // Garder un message pour la création si nécessaire
         toast({
          title: "Succès",
          description: "Création enregistrée avec succès.",
        });
      }

      // Redirection/callback restauré
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        // router.push('/admin/creations'); // Ancienne redirection
        router.refresh(); // Nouvelle méthode pour rafraîchir les données serveur
        router.push('/admin/creations'); // Remettre la redirection APRÈS le refresh
      }
    // Bloc catch unique restauré
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue.';
      // Afficher le toast d'erreur
      const actionText = creationId ? 'de la mise à jour' : 'de l\'enregistrement'; // Utilisation de creationId restaurée
      toast({
        title: "Erreur ❌",
        description: `Échec ${actionText} : ${errorMessage}`
        // variant: "destructive", // Supprimé car non supporté par le type Toast
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la création *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tarte Tatin revisitée" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description courte</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez brièvement votre création..."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Image restauré (URL ou Upload) */}
        {/* Note: Le nom du champ est 'imageUrl' dans le schéma Zod restauré */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => ( // Utiliser field pour l'input URL si besoin, mais gérer upload séparément
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange} // Gestionnaire restauré
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="picture"
                    className={cn(
                      "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choisir une image
                  </label>
                  {/* Preview restaurée */}
                  {imagePreview && (
                    <div className="relative h-20 w-20 rounded border">
                      <Image
                        src={imagePreview}
                        alt="Aperçu"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Chargez une image ou collez une URL (l'upload n'est pas géré pour la modification, l'URL n'est pas gérée pour la création via FormData).
                {/* Champ URL optionnel si besoin */}
                {/* <Input type="url" placeholder="Ou collez une URL ici..." onChange={(e) => { field.onChange(e.target.value); setImagePreview(e.target.value); }} value={typeof field.value === 'string' ? field.value : ''} className="mt-2" disabled={isSubmitting}/> */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Champ Date restauré */}
        <FormField
          control={form.control}
          name="creationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de création *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border shadow-md" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date('1900-01-01') || isSubmitting
                    }
                    initialFocus
                    locale={fr} // Calendrier en français
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto"> {/* Ajustement largeur bouton */}
          {/* Texte bouton restauré */}
          {isSubmitting ? (creationId ? 'Mise à jour...' : 'Enregistrement...') : (creationId ? '💾 Enregistrer les modifications' : 'Créer la création')}
        </Button>
      </form>
    </Form>
  );
}