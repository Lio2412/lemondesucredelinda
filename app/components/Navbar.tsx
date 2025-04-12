import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adaptez le chemin si nécessaire
import UserMenu from './UserMenu';

// Décommentez et adaptez l'import de authOptions si vous l'utilisez ailleurs
// Sinon, vous pouvez passer directement la configuration à getServerSession si elle est simple

export default async function Navbar() {
  // Adaptez l'appel à getServerSession selon votre configuration authOptions
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(); // Exemple simple si authOptions n'est pas complexe ou importé

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold">
          Le Monde Sucré de Linda
        </Link>
        
        {/* Autres éléments de la navbar ici (liens, etc.) */}
        
        <div className="flex items-center space-x-4">
          {/* Le bouton Connexion est supprimé */}
          <UserMenu session={session} />
        </div>
      </nav>
    </header>
  );
}
