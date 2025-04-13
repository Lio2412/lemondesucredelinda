'use client';

import React, { useState } from 'react'; // Importer useState
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitHandler, FieldValues, Control } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils'; // Importer cn pour le bouton stylisé

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch"; // Importer Switch
import { Label } from "@/components/ui/label"; // Importer Label
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Schéma pour un ingrédient individuel (adapté pour Prisma)
const ingredientSchema = z.object({
  // id n'est plus nécessaire ici, Prisma le gère
  name: z.string().min(1, { message: 'Le nom est requis.' }),
  // Utiliser coerce.number() pour convertir la chaîne en nombre (Float dans Prisma)
  quantity: z.coerce.number().positive({ message: 'La quantité doit être un nombre positif.' }),
  unit: z.string().min(1, { message: 'L\'unité est requise.' }),
});

// Schéma pour une étape individuelle (adapté pour Prisma)
const stepSchema = z.object({
  // order sera géré par l'index dans le tableau lors de la soumission
  description: z.string().min(10, { message: 'Décrivez l\'étape (min 10 caractères).' }),
  // Duration en minutes dans le formulaire, sera converti si nécessaire pour Prisma (secondes?)
  duration: z.coerce.number().int().positive().optional(),
});

// Schéma de validation Zod mis à jour pour correspondre au modèle Prisma
const recipeFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères.' }),
  slug: z.string().min(3, { message: 'Le slug doit contenir au moins 3 caractères.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug invalide (lettres minuscules, chiffres, tirets).' }),
  description: z.string().optional(),
  difficulty: z.string().optional(), // Pourrait être un enum plus tard
  prepTime: z.coerce.number().int().nonnegative().optional(), // Temps en minutes
  cookTime: z.coerce.number().int().nonnegative().optional(), // Temps en minutes
  basePortions: z.coerce.number().int().positive({ message: 'Le nombre de portions doit être positif.' }),
  category: z.string().optional(), // Catégorie optionnelle
  image: z.union([z.string().url().optional(), z.any().optional()]), // Garder la logique image
  ingredients: z.array(ingredientSchema).min(1, { message: 'Ajoutez au moins un ingrédient.' }),
  steps: z.array(stepSchema).min(1, { message: 'Ajoutez au moins une étape.' }),
  published: z.boolean(), // Rendre non-optionnel, defaultValues gère l'initialisation
});

// Le type inféré devrait maintenant correspondre plus directement
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

// Mock data pour les catégories
const categories = [
  { value: 'entremet', label: 'Entremet' },
  { value: 'tarte', label: 'Tarte' },
  { value: 'biscuit', label: 'Biscuit' },
  { value: 'gateau_voyage', label: 'Gâteau de voyage' },
  { value: 'viennoiserie', label: 'Viennoiserie' },
  { value: 'confiserie', label: 'Confiserie' },
];

interface RecipeFormProps {
  initialData?: RecipeFormValues | null;
  recipeId?: string; // Ajouter l'ID pour le mode édition
}

// Définir les valeurs par défaut pour un nouveau formulaire (mis à jour)
const defaultFormValues: RecipeFormValues = {
  title: '',
  slug: '',
  description: '',
  difficulty: '',
  prepTime: undefined,
  cookTime: undefined,
  basePortions: 4, // Garder une valeur par défaut raisonnable
  category: '',
  image: undefined,
  // Adapter les valeurs par défaut pour quantity (nombre)
  ingredients: [{ name: '', quantity: 1, unit: '' }],
  steps: [{ description: '', duration: undefined }],
  published: false, // Valeur par défaut pour published
};


export function RecipeForm({ initialData = null, recipeId }: RecipeFormProps) { // Récupérer recipeId
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    // Afficher l'image initiale si c'est une URL valide
    typeof initialData?.image === 'string' ? initialData.image : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast(); // Obtenir la fonction toast
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialData ?? defaultFormValues,
    mode: 'onChange',
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients"
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps"
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file); // Stocker l'objet File
    } else {
      setImagePreview(null);
      form.setValue('image', undefined);
    }
  };

  const onSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    setIsSubmitting(true);

    const isEditing = !!recipeId;
    const imageFile = data.image instanceof File ? data.image : undefined;
    const currentImageUrl = typeof data.image === 'string' ? data.image : undefined;

    // Préparer les données à envoyer
    let body: FormData | string;
    let headers: HeadersInit = {};

    // Ne plus transformer en string[], envoyer les objets directement
    // const ingredientsStrings = data.ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`.trim());
    // const stepsStrings = data.steps.map(step => step.description);

    if (imageFile) {
      // Si une nouvelle image est fournie, utiliser FormData
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      if (data.difficulty) formData.append('difficulty', data.difficulty);
      if (data.prepTime !== undefined) formData.append('prepTime', data.prepTime.toString());
      if (data.cookTime !== undefined) formData.append('cookTime', data.cookTime.toString());
      formData.append('basePortions', data.basePortions.toString());
      if (data.category) formData.append('category', data.category);

      // Envoyer les tableaux d'objets structurés sous forme de JSON stringifié
      formData.append('ingredients', JSON.stringify(data.ingredients));
      formData.append('steps', JSON.stringify(data.steps));
formData.append('published', data.published.toString()); // Ajouter published à FormData
formData.append('image', imageFile);
      formData.append('image', imageFile);
      if (isEditing && currentImageUrl) {
        formData.append('currentImageUrl', currentImageUrl);
      }

      body = formData;
      // Ne pas définir Content-Type pour FormData
    } else {
      // Sinon, envoyer en JSON standard avec les données structurées
      const payload = {
        ...data, // Inclure tous les champs du formulaire (title, slug, description, etc.)
        image: currentImageUrl, // Garde l'URL existante ou undefined
        // Les ingrédients et étapes sont déjà dans data avec la bonne structure
      };
      body = JSON.stringify(payload);
      headers['Content-Type'] = 'application/json';
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `/api/recipes/${recipeId}` : '/api/recipes';

      const response = await fetch(endpoint, {
        method: method,
        headers: headers, // Utiliser les headers définis
        body: body,       // Utiliser le body préparé (FormData ou JSON string)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Échec de la ${recipeId ? 'mise à jour' : 'création'}`);
      }

      // Afficher le toast uniquement en cas de mise à jour réussie
      if (recipeId && response.ok) {
        toast({
          title: "Succès",
          description: "✅ Recette mise à jour avec succès !",
        });
      } else if (!recipeId && response.ok) {
        // Garder un message pour la création si nécessaire, ou ajuster
         toast({
          title: "Succès",
          description: "Recette enregistrée avec succès.",
        });
      }

      router.push('/admin/recipes'); // Rediriger vers la liste
      router.refresh(); // Rafraîchir les données de la liste

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        // variant: "destructive", // Retiré si non supporté
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const control: Control<RecipeFormValues> = form.control;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations Générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la recette *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tarte aux pommes classique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="basePortions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de portions *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        // Simplifier onChange: toujours passer un nombre valide
                        onChange={e => {
                          const value = parseInt(e.target.value, 10);
                          // Si la valeur n'est pas un nombre ou est < 1, forcer à 1 (ou une autre valeur par défaut logique)
                          field.onChange(isNaN(value) || value < 1 ? 1 : value);
                        }}
                        // Afficher la valeur numérique, ou vide si elle n'est pas encore définie (ce qui ne devrait pas arriver avec defaultValues)
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-md">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Champ Published (Switch) */}
              <FormField
                control={control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1 md:col-span-2 mt-4 md:mt-0">
                    <div className="space-y-0.5">
                      <FormLabel>Publier la recette</FormLabel>
                      <FormDescription>
                        Rendre cette recette visible publiquement.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Slug */}
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: tarte-aux-pommes-classique" {...field} />
                  </FormControl>
                  <FormDescription>
                    Identifiant unique pour l'URL (minuscules, chiffres, tirets).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Décrivez brièvement la recette..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* Image */}
             <FormItem>
               <FormLabel>Image de la recette</FormLabel>
               <FormControl>
                 <div className="flex items-center gap-4">
                   <Input
                     id="recipeImage"
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="hidden"
                     disabled={isSubmitting}
                   />
                   <label
                     htmlFor="recipeImage"
                     className={cn(
                       "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                       "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                       isSubmitting && "opacity-50 cursor-not-allowed"
                     )}
                   >
                     <Upload className="mr-2 h-4 w-4" />
                     Choisir une image
                   </label>
                   {imagePreview && (
                     <div className="relative h-20 w-32 rounded border overflow-hidden">
                       <Image src={imagePreview} alt="Aperçu recette" fill style={{ objectFit: 'cover' }} className="rounded" />
                     </div>
                   )}
                   {!imagePreview && typeof initialData?.image !== 'string' && (
                     <div className="relative h-20 w-32 rounded border overflow-hidden bg-muted">
                       <Image src="/images/default-recipe.jpg" alt="Image par défaut" fill style={{ objectFit: 'cover' }} className="rounded opacity-50" />
                     </div>
                   )}
                 </div>
               </FormControl>
               <FormDescription>Chargez une image pour votre recette.</FormDescription>
               <FormMessage />
             </FormItem>
          </CardContent>
        </Card>

        <Separator />

        {/* Détails Recette */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la Recette</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulté</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner difficulté" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-md">
                        <SelectItem value="Facile">Facile</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Difficile">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de préparation (min)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Ex: 30" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="cookTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de cuisson (min)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Ex: 45" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Section Ingrédients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingrédients</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {ingredientFields.map((field, index) => (
                 <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-md relative">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
                     <FormField
                       control={control}
                       name={`ingredients.${index}.name`}
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Nom *</FormLabel>
                           <FormControl>
                             <Input placeholder="Ex: Farine T55" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={control}
                       name={`ingredients.${index}.quantity`}
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Quantité *</FormLabel>
                           <FormControl>
                             {/* Utiliser type="number" et step="any" pour les floats */}
                             <Input type="number" step="any" min="0" placeholder="Ex: 250" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={control}
                       name={`ingredients.${index}.unit`}
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Unité *</FormLabel>
                           <FormControl>
                             <Input placeholder="Ex: g" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                   </div>
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => removeIngredient(index)}
                     className="mt-6 md:mt-0 flex-shrink-0"
                     aria-label="Supprimer l'ingrédient"
                   >
                     <Trash2 className="h-4 w-4 text-red-500" />
                   </Button>
                 </div>
               ))}
             </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => appendIngredient({ name: '', quantity: 1, unit: '' })} // Mettre quantité par défaut
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un ingrédient
            </Button>
            {form.formState.errors.ingredients?.root?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.ingredients.root.message}
                </p>
            )}
             {form.formState.errors.ingredients?.message && !form.formState.errors.ingredients?.root?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.ingredients.message}
                </p>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Section Étapes */}
        <Card>
          <CardHeader>
            <CardTitle>Étapes de préparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stepFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md space-y-4 relative">
                   <div className="flex justify-between items-start">
                     <h4 className="font-medium">Étape {index + 1}</h4>
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       onClick={() => removeStep(index)}
                       className="absolute top-2 right-2"
                       aria-label="Supprimer l'étape"
                     >
                       <Trash2 className="h-4 w-4 text-red-500" />
                     </Button>
                   </div>

                  <FormField
                    control={control}
                    name={`steps.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ex: Mélanger la farine et le sucre..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`steps.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée (minutes, optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Ex: 15"
                            {...field}
                            value={field.value ?? ''}
                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => appendStep({ description: '', duration: undefined })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une étape
            </Button>
             {form.formState.errors.steps?.root?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.steps.root.message}
                </p>
            )}
             {form.formState.errors.steps?.message && !form.formState.errors.steps?.root?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.steps.message}
                </p>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isSubmitting ? (recipeId ? 'Mise à jour...' : 'Enregistrement...') : (recipeId ? '💾 Enregistrer les modifications' : 'Créer la recette')}
          </Button>
        </div>
      </form>
    </Form>
  );
}