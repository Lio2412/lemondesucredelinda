'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { newsletterTemplates, NewsletterTemplate } from '@/lib/newsletterTemplates'; // Importer aussi le type
import { ScrollArea } from '@/components/ui/scroll-area'; // Importer ScrollArea

export function NewsletterForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classique'); // État pour le template
  const [isSending, setIsSending] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Effet pour charger le brouillon depuis localStorage au montage
  useEffect(() => {
    const draftJson = localStorage.getItem('newsletterDraft');
    if (draftJson) {
      try {
        const draft = JSON.parse(draftJson);
        if (draft && typeof draft.title === 'string' && typeof draft.message === 'string') {
          setTitle(draft.title);
          setMessage(draft.message);
          toast.info('Brouillon de newsletter chargé depuis l\'historique.');
        }
      } catch (error) {
        console.error('Erreur lors du parsing du brouillon depuis localStorage:', error);
        toast.error('Impossible de charger le brouillon.');
      } finally {
        // Toujours supprimer l'élément après tentative de lecture
        localStorage.removeItem('newsletterDraft');
      }
    }
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'au montage

  // Effet pour initialiser le message avec l'exemple du template par défaut
  useEffect(() => {
    if (!message && newsletterTemplates[selectedTemplateId]) {
      setMessage(newsletterTemplates[selectedTemplateId].exampleMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]); // S'exécute quand selectedTemplateId change

  const handleTemplateChange = (newTemplateId: string) => {
    if (newsletterTemplates[newTemplateId]) {
      setSelectedTemplateId(newTemplateId);
      setMessage(newsletterTemplates[newTemplateId].exampleMessage);
      toast.info(`Template "${newsletterTemplates[newTemplateId].name}" chargé avec son exemple.`);
    }
  };

  // Fonction simulée pour récupérer le nombre d'abonnés
  const getSubscriberCount = async (): Promise<number> => {
    // TODO: Remplacer par un appel API réel pour obtenir le compte
    await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai réseau
    // Retourner une valeur fixe pour la démo
    return 125; // Exemple: 125 abonnés
    // return 0; // Exemple: 0 abonnés pour tester l'autre cas
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !message || isSending) {
      return;
    }

    setIsSending(true);
    let loadingToastId: string | number | undefined = undefined;
    let subscriberCount = 0; // Initialiser le compteur

    try {
      // 1. Récupérer (simuler) le nombre d'abonnés
      subscriberCount = await getSubscriberCount();

      // 2. Afficher le toast de statistiques
      if (subscriberCount > 0) {
        toast.info(`Préparation de l'envoi à ${subscriberCount} abonnés...`);
      } else {
        toast.warning("Aucun abonné à cibler pour cette newsletter.");
        // Optionnel: arrêter l'envoi s'il n'y a personne ?
        // Pour l'instant on continue.
      }

      // 3. Démarrer le toast de chargement pour l'envoi réel
      loadingToastId = toast.loading('Envoi de la newsletter en cours...');

      // 4. Effectuer l'appel API pour envoyer la newsletter
      // TODO: Remplacer '/api/send-newsletter' par la vraie route API si elle existe
      const response = await fetch('/api/admin/newsletter/send', { // Mise à jour potentielle de l'URL API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message, selectedTemplateId }), // Ajout de selectedTemplateId
      });

      const result = await response.json();

      if (response.ok) {
        // Afficher le toast de succès final (remplace le toast de chargement)
        const successMessage = subscriberCount > 0
          ? `📤 Newsletter envoyée à ${subscriberCount} abonnés !`
          : 'Newsletter envoyée (mais aucun abonné ciblé).';
        toast.success(result.message || successMessage, { id: loadingToastId });

        setTitle(''); // Réinitialiser les champs après succès
        setMessage('');
        // Réinitialiser au template par défaut et son message exemple
        setSelectedTemplateId('classique');
        setMessage(newsletterTemplates['classique'].exampleMessage);
      } else {
        // Afficher le toast d'erreur (remplace le toast de chargement)
        toast.error(result.error || "Erreur lors de l'envoi de la newsletter.", { id: loadingToastId });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission ou de l'appel API:", error);
      // Assurer que le toast de chargement est fermé en cas d'erreur avant l'appel API ou pendant
      if (loadingToastId) {
        toast.error("Une erreur réseau ou inattendue est survenue.", { id: loadingToastId });
      } else {
        // Si l'erreur survient avant même le toast de chargement (ex: getSubscriberCount)
        toast.error("Une erreur est survenue avant l'envoi.");
      }
    } finally {
      // Assurer que l'état de chargement est désactivé
      setIsSending(false);
    }
  };

  const isFormInvalid = !title || !message;

  // Fonction pour générer l'HTML de l'aperçu
  const getPreviewHtml = () => {
    const template: NewsletterTemplate | undefined = newsletterTemplates[selectedTemplateId];
    if (!template) return '';

    // Générer le HTML de base avec le message
    let htmlContent = template.htmlWrapper(message || "Votre contenu ici...");

    // Essayer de remplacer le titre générique du template par le titre du formulaire
    const titlePlaceholderRegex = /<h1[^>]*>Template [^<]+<\/h1>/i;
    const formTitleHtml = title ? `<h1>${title}</h1>` : '<h1>Aperçu</h1>';

    if (titlePlaceholderRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(titlePlaceholderRegex, formTitleHtml);
    }

    return htmlContent;
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Envoyer une Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template">Template Visuel</Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateChange} disabled={isSending}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(newsletterTemplates).map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titre / Sujet</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sujet de votre newsletter"
                disabled={isSending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contenu de votre newsletter..."
                rows={10}
                disabled={isSending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date d'envoi (optionnel)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={isSending}
              />
              <p className="text-sm text-muted-foreground">
                Laissez vide pour envoyer immédiatement.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isFormInvalid || isSending}
              className={isSending ? 'animate-pulse' : ''}
            >
              {isSending ? 'Envoi en cours...' : 'Envoyer la newsletter'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Section Aperçu Améliorée */}
      {(title || message) && (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aperçu du rendu final</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/40">
              <div
                dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                className="prose prose-sm max-w-none"
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
}