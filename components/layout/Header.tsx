'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Regrouper les imports de next/navigation
import { useState } from 'react'; // Garder useState pour le Sheet si besoin de contrôle manuel
// Les imports Link et usePathname en double sont supprimés
import { Menu, LogIn, LogOut, ShieldCheck, User2 } from 'lucide-react'; // X n'est plus nécessaire ici
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel, // Pas utilisé actuellement dans le desktop dropdown
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Réimporter DropdownMenu pour le desktop
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import { signIn, signOut } from "next-auth/react"; // Garder signIn et signOut
import { Playfair_Display } from 'next/font/google'; // Importer la police

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'], // Poids utilisé pour le logo
  display: 'swap',
});

// Liens de navigation
const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Recettes', href: '/recettes' },
  { name: 'Créations', href: '/creations' }, // Ajout du lien Créations
  { name: 'Blog', href: '/blog' },
  { name: 'À Propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

// Définir l'interface des props pour accepter userRole
interface HeaderProps {
  userRole?: string | null;
}

// useRouter est déjà importé plus haut

export default function Header({ userRole }: HeaderProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false); // État pour contrôler le Sheet si nécessaire
  const pathname = usePathname();
  // Supprimer useSession, isLoading et isAuthenticated. L'état est déterminé par userRole.
  const isAdmin = userRole === 'admin';

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700/50">
      <div className="h-0.5 w-full bg-gradient-to-r from-pink-200/80 via-pink-300/80 to-pink-200/80 dark:from-pink-700/30 dark:via-pink-600/30 dark:to-pink-700/30"></div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 md:h-20 justify-between items-center"> {/* Hauteur ajustée */}

          {/* Logo */}
          {/* Logo à gauche (sans flex-1) */}
          <div className="flex">
            <Link href="/" className="flex flex-col items-center group -m-1.5 p-1.5">
              <div className="relative">
                <span className={`text-xl md:text-2xl tracking-wide text-gray-800 dark:text-white ${playfairDisplay.className}`}> {/* Rétablissement: Texte sombre */}
                  Le Monde Sucré
                </span>
                {/* Soulignement animé au survol */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-pink-400 to-pink-500 dark:from-pink-500 dark:to-pink-600 group-hover:w-full transition-all duration-300"></span> {/* Rétablissement couleur soulignement */}
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-pink-500 dark:text-pink-400 mt-0.5 font-light"> {/* Rétablissement couleur sous-titre */}
                de Linda
              </span>
            </Link>
          </div>

          {/* --- Menu Mobile (Sheet) --- */}
          <div className="md:hidden"> {/* Changé lg:hidden en md:hidden */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-white dark:bg-gray-950 p-4 pt-8"> {/* Style et padding ajustés */}
                <SheetHeader className="mb-4 border-b pb-3 dark:border-gray-800">
                  <SheetTitle className={`text-xl text-gray-800 dark:text-white ${playfairDisplay.className}`}>
                    Le Monde Sucré
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 text-sm"> {/* Ajustement gap */}
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`block rounded-md px-3 py-2 font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-pink-50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        onClick={() => setSheetOpen(false)} // Ferme le sheet au clic
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}

                  <Separator className="my-3 dark:bg-gray-700" />

                  {isAdmin ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-pink-600 dark:text-pink-400 font-medium hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors"
                          onClick={() => setSheetOpen(false)}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={() => {
                            signOut();
                            setSheetOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                       <Link
                         href="/login"
                         className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                         onClick={() => setSheetOpen(false)}
                       >
                         <LogIn className="w-4 h-4" />
                         Connexion
                       </Link>
                    </SheetClose>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* --- Fin Menu Mobile (Sheet) --- */}

          {/* Navigation Desktop */}
          {/* Navigation Desktop Principale */}
          {/* Navigation Desktop Principale (centrée) */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-x-6"> {/* Changé lg:flex en md:flex */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium leading-6 transition-colors duration-200 px-3 py-2 rounded-md ${ // Ajustement padding si besoin
                  pathname === item.href
                    ? 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bouton Connexion/Déconnexion Desktop */}
          {/* Actions Admin (Dropdown) ou Connexion (tout à droite) */}
          {/* Actions Admin (Dropdown) ou Connexion (à droite, sans ml-auto car justify-between gère) */}
          <div className="hidden md:flex items-center"> {/* Changé lg:flex en md:flex */}
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Utilisation de User2 et ajustement style/taille */}
                  {/* Ajout des classes pour supprimer l'anneau de focus */}
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-pink-600 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <User2 className="w-5 h-5" />
                    <span className="sr-only">Menu administrateur</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
                  {/* Simplification du contenu pour correspondre à l'exemple */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin" className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-gray-500" /> {/* Icône dans le lien */}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-sm text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Lien Connexion pour non-admin
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 transition h-auto px-3 py-1.5"
                )}
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* L'ancien menu mobile est supprimé et remplacé par le Sheet ci-dessus */}
    </header>
  );
}