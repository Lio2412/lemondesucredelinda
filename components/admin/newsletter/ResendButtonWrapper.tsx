'use client';

import React, { useState } from 'react'; // Importer useState
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NewsletterCampaign } from '@prisma/client';
import { useToast } from '@/hooks/use-toast'; // Importer useToast
import { Loader2 } from 'lucide-react'; // Importer l'icône de chargement

interface ResendButtonWrapperProps {
  campaign: NewsletterCampaign;
}

function ResendButtonWrapper({ campaign }: ResendButtonWrapperProps) {
  const router = useRouter();
  const { toast } = useToast(); // Initialiser le hook toast
  const [isLoading, setIsLoading] = useState(false); // Ajouter l'état de chargement

  const handleResend = async () => { // Rendre la fonction async pour la simulation potentielle
    setIsLoading(true); // Activer le chargement
    const { title, message } = campaign;
    const draft = { title, message };
    try {
      // Simuler une petite attente pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem('newsletterDraft', JSON.stringify(draft));
      toast({
        title: "✅ Newsletter chargée !", // Ajout d'un indicateur visuel
        description: "Le contenu a été pré-rempli dans le formulaire.",
        // variant: "default", // Supprimé
      });
      router.push('/admin/newsletter');
      // Pas besoin de setIsLoading(false) ici car on navigue
    } catch (error) {
      console.error("Erreur lors de l'enregistrement dans localStorage:", error);
      toast({
        title: "❌ Échec du chargement", // Ajout d'un indicateur visuel
        description: "Impossible de charger le brouillon dans le formulaire.",
        // variant: "destructive", // Supprimé
      });
      setIsLoading(false); // Désactiver le chargement en cas d'erreur
    }
    // Ne pas mettre setIsLoading(false) dans un finally ici car la navigation le gère en cas de succès
  };

  return (
    <Button
      onClick={handleResend}
      variant="outline"
      disabled={isLoading} // Désactiver pendant le chargement
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        'Renvoyer'
      )}
    </Button>
  );
}

export default ResendButtonWrapper;