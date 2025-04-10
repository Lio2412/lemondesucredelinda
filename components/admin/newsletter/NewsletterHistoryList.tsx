"use client";

import { useState } from 'react';
import React from 'react';

import { NewsletterCampaign } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import ResendButtonWrapper from './ResendButtonWrapper'; // Assurez-vous que ce chemin est correct après déplacement

interface NewsletterHistoryListProps {
  campaigns: NewsletterCampaign[];
}

const truncateMessage = (message: string, maxLength = 150) => {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength) + '...';
};

export function NewsletterHistoryList({ campaigns }: NewsletterHistoryListProps) {
  const [displayedCampaigns, setDisplayedCampaigns] = useState<NewsletterCampaign[]>(campaigns);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Stocke l'ID de la campagne en cours de suppression

  const handleDelete = async (campaignId: string) => {
    setIsDeleting(campaignId);
    try {
      const response = await fetch(`/api/admin/newsletter/${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Suppression réussie
      setDisplayedCampaigns(prev => prev.filter(c => c.id !== campaignId));
      toast.success("Newsletter supprimée de l'historique.");

    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(`Échec de la suppression: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsDeleting(null); // Réinitialiser l'état de chargement dans tous les cas
    }
  };

  return (
    <div className="mt-8"> {/* Ajout d'une marge supérieure */}
      <h2 className="text-2xl font-semibold mb-4">Historique des envois</h2>
      {displayedCampaigns.length === 0 ? (
        <p>Aucune newsletter n'a été envoyée pour le moment.</p>
      ) : (
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <div className="p-4 space-y-6">
            {displayedCampaigns.map((campaign, index) => (
              // Utilisation de React.Fragment pour gérer la clé et le séparateur
              <React.Fragment key={campaign.id}>
                <Card>
                  {/* Ajout padding au header */}
                  <CardHeader className="pb-2">
                    {/* Assurer que le titre est en gras (normalement par défaut) */}
                    <CardTitle className="font-bold">{campaign.title}</CardTitle>
                    {/* Application des classes spécifiques au Badge */}
                    <Badge variant="secondary" className="text-xs mt-1 w-fit"> {/* Changé pour variant="secondary" pour meilleur contraste par défaut */}
                      Envoyée le: {format(new Date(campaign.sentAt), 'dd/MM/yyyy', { locale: fr })}
                    </Badge>
                  </CardHeader>
                  {/* Ajout padding au content */}
                  <CardContent className="pt-0 pb-4">
                    {/* Ajout line-clamp-3 et ajustement style */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {campaign.message} {/* Utilisation directe, line-clamp gère l'affichage */}
                    </p>
                    <Badge variant="secondary" className="text-sm text-muted-foreground mt-2">
                      🧁 Envoyé à {campaign.recipientCount} abonnés
                    </Badge>
                    {/* Separator supprimé d'ici */}
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center"> {/* Ajout flex pour aligner les boutons */}
                    <ResendButtonWrapper campaign={campaign} />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={!!isDeleting}> {/* Désactivé si une suppression est en cours */}
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer définitivement cette newsletter de l'historique ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting === campaign.id}>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(campaign.id)}
                            disabled={isDeleting === campaign.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting === campaign.id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Suppression...
                              </span>
                            ) : (
                              'Supprimer'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
                {/* Separator ENTRE les cards */}
                {index < displayedCampaigns.length - 1 && <Separator className="my-4" />}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}