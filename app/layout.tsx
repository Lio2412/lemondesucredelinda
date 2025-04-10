import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Importer la police Inter
import '@/styles/globals.css';
import Header from '@/components/layout/Header'; // Sera copié ensuite
import Footer from '@/components/layout/Footer'; // Sera copié ensuite
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import NextAuthProvider from '@/components/providers/NextAuthProvider'; // Importer le nouveau wrapper
import { cn } from '@/lib/utils';
import { getServerSession } from "next-auth/next"; // Importer getServerSession
import { authOptions } from "@/lib/authOptions"; // Mettre à jour l'import vers le nouveau fichier
import { Toaster as SonnerToaster } from "sonner"; // Import sonner

// Instancier la police Inter
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// Métadonnées mises à jour pour le projet final
export const metadata: Metadata = {
  // TODO: Affiner les métadonnées (icônes, open graph, etc.)
  title: 'Le Monde Sucré de Linda - Recettes de Pâtisserie',
  description: 'Découvrez l\'art de la pâtisserie française avec les recettes authentiques et élégantes de Linda.',
};

export default async function RootLayout({ // Ajouter async ici
  children,
}: {
  children: React.ReactNode;
}) {
  // Récupérer la session côté serveur (déjà présent, mais on s'assure que les imports sont là)
  const session = await getServerSession(authOptions);

  // Passer userRole au composant Header
  const userRole = session?.user?.role; // Obtenir le rôle (peut être undefined ou null)

  return (
    <html lang="fr" suppressHydrationWarning>
      {/* Utiliser la variable de police instanciée */}
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        {/* ThemeProvider est conservé car il gère les classes light/dark utilisées dans globals.css */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}> {/* Forcer le thème clair */}
          {/* Utiliser le wrapper NextAuthProvider qui est un Client Component */}
          <NextAuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header userRole={userRole} />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <SonnerToaster richColors position="bottom-right" /> {/* Utilisation sonner */}
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}