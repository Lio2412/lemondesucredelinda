import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Ce layout s'applique spécifiquement à la route /login et ses enfants (s'il y en avait)
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Récupérer la session pour passer les infos nécessaires au Header (comme le rôle)
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      {/* @ts-ignore */}
      <Header userRole={session?.user?.role} />
      {/* Le contenu de la page /login sera injecté ici */}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}