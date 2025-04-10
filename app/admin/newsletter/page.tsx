import { prisma } from '@/lib/prisma';
import { NewsletterForm } from '@/components/admin/newsletter/NewsletterForm';
import { NewsletterHistoryList } from '@/components/admin/newsletter/NewsletterHistoryList';
import { Separator } from '@/components/ui/separator';

// Assurer que la page est dynamique pour récupérer les données fraîches
export const dynamic = 'force-dynamic';

async function NewsletterAdminPage() {
  // Récupérer l'historique côté serveur
  const campaigns = await prisma.newsletterCampaign.findMany({
    orderBy: {
      sentAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Le formulaire est maintenant un composant client séparé */}
      <NewsletterForm />

      <Separator />

      {/* La liste de l'historique est aussi un composant séparé */}
      {/* On passe les données récupérées côté serveur en props */}
      <NewsletterHistoryList campaigns={campaigns} />
    </div>
  );
}

export default NewsletterAdminPage;