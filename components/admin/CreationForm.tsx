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
import { Checkbox } from '@/components/ui/checkbox'; // Remplacer Switch par Checkbox
import { Label } from '@/components/ui/label';
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
import { IOSImageUpload } from '@/components/ui/ios-image-upload';

// Schéma de validation Zod (restauré pour POST/PUT)
const formSchema = z.object({
  title: z.string().min(3, { // Restauré min(3)
    message: 'Le titre doit contenir au moins 3 caractères.',
  }),
  description: z.string().optional(),
  // Restauré pour accepter URL (string) ou File
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.any()),
  // Le champ creationDate est supprimé car il n'existe pas dans le modèle Prisma
  published: z.boolean().optional(), // Ajout du champ published
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  const form = useForm<CreationFormValues>({
    resolver: zodResolver(formSchema),
    // Valeurs par défaut restaurées utilisant initialData
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || undefined, // Restauré pour type file/string
      // creationDate supprimé des valeurs par défaut
      published: initialData?.published || false, // Ajout de la valeur par défaut pour published
    },
  });

  // Gestionnaire simplifié pour le nouveau composant iOS
  const handleImageSelect = (file: File) => {
    console.log('[DIAGNOSTIC iOS] handleImageSelect appelé avec:', {
      name: file.name,
      type: file.type,
      size: file.size,
      timestamp: new Date().toISOString()
    });
    
    setSelectedImage(file);
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      console.log('[DIAGNOSTIC iOS] Preview créé avec succès');
    };
    reader.readAsDataURL(file);
    
    // Mettre à jour le formulaire
    form.setValue('imageUrl', file);
    console.log('[DIAGNOSTIC iOS] Formulaire mis à jour avec le fichier');
    
    console.log('[iOS Image Upload] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
  };

  // Fonction onSubmit restaurée pour gérer POST et PUT
  const onSubmit = async (values: CreationFormValues) => {
    console.log('[DIAGNOSTIC iOS] onSubmit démarré avec values:', {
      title: values.title,
      hasFile: values.imageUrl instanceof File,
      fileSize: values.imageUrl instanceof File ? values.imageUrl.size : 'N/A',
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(true);
    let response: Response;
    const method = creationId ? 'PUT' : 'POST'; // Logique conditionnelle restaurée
    const endpoint = creationId ? `/api/creations/${creationId}` : '/api/creations'; // Logique conditionnelle restaurée

    try {
      if (method === 'PUT') {
        // Si une nouvelle image est sélectionnée (c'est un File), envoyer FormData
        if (values.imageUrl instanceof File) {
          console.log('[DIAGNOSTIC iOS] PUT avec FormData - Préparation...');
          const formData = new FormData();
          formData.append('title', values.title);
          formData.append('description', values.description || "");
          formData.append('image', values.imageUrl, values.imageUrl.name);
          formData.append('published', String(values.published ?? false)); // Ajouter published pour PUT avec FormData
          
          console.log('[DIAGNOSTIC iOS] FormData créé pour PUT:', {
            title: values.title,
            fileName: values.imageUrl.name,
            fileSize: values.imageUrl.size
          });

          const startTime = Date.now();
          response = await fetch(endpoint, {
            method: 'PUT',
            body: formData, // Envoyer FormData
          });
          const endTime = Date.now();
          
          console.log('[DIAGNOSTIC iOS] Réponse PUT reçue:', {
            status: response.status,
            ok: response.ok,
            duration: endTime - startTime,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log('[DIAGNOSTIC iOS] PUT avec JSON - Pas de nouvelle image');
          // Sinon (pas de nouvelle image), envoyer JSON sans l'image
          const payload = {
            title: values.title,
            description: values.description,
            published: values.published ?? false, // Ajouter published pour PUT avec JSON
            // Ne pas inclure 'image' ici pour ne pas écraser l'existante par erreur
          };
          response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }

      } else { // POST
        console.log('[DIAGNOSTIC iOS] POST avec FormData - Préparation...');
        // Logique POST restaurée (envoi FormData)
        const formData = new FormData();
        formData.append('title', values.title);
        // Assurer que la description est envoyée, même si vide (car requise par Prisma)
        formData.append('description', values.description || "");

        // Ajouter le fichier image s'il existe et est un objet File
        if (values.imageUrl instanceof File) {
          formData.append('image', values.imageUrl, values.imageUrl.name);
          console.log('[DIAGNOSTIC iOS] Image ajoutée au FormData:', {
            name: values.imageUrl.name,
            type: values.imageUrl.type,
            size: values.imageUrl.size
          });
        } else {
          console.log('[DIAGNOSTIC iOS] Aucune image à ajouter au FormData');
        }
        formData.append('published', String(values.published ?? false)); // Ajouter published pour POST avec FormData

        console.log('[DIAGNOSTIC iOS] FormData créé pour POST, envoi en cours...');
        const startTime = Date.now();
        
        response = await fetch(endpoint, {
          method: 'POST',
          body: formData, // Envoyer FormData (pas de header Content-Type nécessaire, le navigateur le définit)
        });
        
        const endTime = Date.now();
        console.log('[DIAGNOSTIC iOS] Réponse POST reçue:', {
          status: response.status,
          ok: response.ok,
          duration: endTime - startTime,
          timestamp: new Date().toISOString()
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue lors de la requête.' }));
        console.error('[DIAGNOSTIC iOS] Erreur réponse serveur:', {
          status: response.status,
          errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Succès (commun aux deux méthodes)
      const resultData = await response.json(); // Récupérer la réponse (optionnel)
      console.log('[DIAGNOSTIC iOS] Succès - Données reçues:', {
        resultData,
        timestamp: new Date().toISOString()
      });

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
      console.error("[DIAGNOSTIC iOS] Erreur lors de l'envoi du formulaire:", {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
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
      console.log('[DIAGNOSTIC iOS] onSubmit terminé');
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

        {/* Champ Image avec composant iOS optimisé */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                Image
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDebugMode(!debugMode)}
                  className="text-xs h-6 px-2"
                >
                  {debugMode ? 'Masquer Debug' : 'Debug iOS'}
                </Button>
              </FormLabel>
              <FormControl>
                <IOSImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={initialData?.imageUrl && typeof initialData.imageUrl === 'string' ? initialData.imageUrl : undefined}
                  debugMode={debugMode}
                  className="w-full"
                />
              </FormControl>
              {selectedImage && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✅ Nouvelle image sélectionnée: {selectedImage.name}</p>
                  <p>Taille: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
              <FormDescription>
                Interface optimisée pour iOS avec diagnostic intégré. Cliquez sur "Debug iOS" pour voir les détails techniques.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            // Adapter la structure pour Checkbox (label à côté)
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  aria-readonly={isSubmitting}
                  id="published" // Ajouter un id pour le label
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <Label htmlFor="published" className="text-base"> {/* Utiliser htmlFor */}
                  Publier
                </Label>
                <FormDescription>
                  Rendre cette création visible sur le site public.
                </FormDescription>
              </div>
              <FormMessage /> {/* Déplacer FormMessage ici pour être cohérent */}
            </FormItem>
          )}
        />


        {/* Le champ Date a été supprimé car il n'existe pas dans le modèle Prisma */}
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto"> {/* Ajustement largeur bouton */}
          {/* Texte bouton restauré */}
          {isSubmitting ? (creationId ? 'Mise à jour...' : 'Enregistrement...') : (creationId ? '💾 Enregistrer les modifications' : 'Créer la création')}
        </Button>
      </form>
    </Form>
  );
}