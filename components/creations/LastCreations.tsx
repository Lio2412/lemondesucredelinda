import Link from 'next/link';
// Image, Card, CardContent, CardHeader, CardTitle, formatDate ne sont plus nécessaires ici car gérés par CreationCard
// import { getLastCreations } from '@/lib/data/creations'; // Sera fait dans le composant parent
import { buttonVariants } from '@/components/ui/button';
import CreationCard from './CreationCard';
import type { Creation } from '@prisma/client'; // Utiliser le type Prisma
import { Playfair_Display } from 'next/font/google'; // Importer la police
// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'], // Poids utilisé pour le titre
  display: 'swap',
});

// Définir les props attendues
interface LastCreationsProps {
  creations: Creation[];
}

// Transformer en composant synchrone qui reçoit les données en props
const LastCreations = ({ creations }: LastCreationsProps) => {
  // Les données sont maintenant passées via les props
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/40"> {/* Ajout d'un fond léger et padding */}
      <div className="container px-4 md:px-6"> {/* Utilisation d'un container pour centrer */}
        {/* Titre de section harmonisé */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`text-3xl font-light mb-4 text-gray-900 sm:text-4xl md:text-5xl ${playfairDisplay.className}`}>
            Mes Dernières Créations
          </h2>
          <div className="w-20 h-px bg-pink-600 mx-auto"></div> {/* Séparateur */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {creations.map((creation) => (
            // Utiliser le composant CreationCard qui contient déjà le Link
            <CreationCard key={creation.id} creation={creation} />
          ))}
        </div>
        <div className="mt-8 md:mt-12 text-center">
          {/* Application directe des styles du bouton au Link */}
          <Link href="/creations" className={buttonVariants({ variant: "outline" })}>
            Voir toutes les créations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LastCreations;