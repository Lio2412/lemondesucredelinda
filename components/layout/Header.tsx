'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, LogIn, LogOut, ShieldCheck, User, User2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { signIn, signOut, useSession } from "next-auth/react"; 
import { Playfair_Display } from 'next/font/google';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'], 
  display: 'swap',
});

// Liens de navigation
const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Recettes', href: '/recettes' },
  { name: 'Créations', href: '/creations' }, 
  { name: 'Blog', href: '/blog' },
  { name: 'À Propos', href: '/a-propos' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700/50">
      <div className="h-0.5 w-full bg-gradient-to-r from-pink-200/80 via-pink-300/80 to-pink-200/80 dark:from-pink-700/30 dark:via-pink-600/30 dark:to-pink-700/30"></div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 md:h-20 justify-between items-center"> 

          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex flex-col items-center group -m-1.5 p-1.5">
              <div className="relative">
                <span className={`text-xl md:text-2xl tracking-wide text-gray-800 dark:text-white ${playfairDisplay.className}`}> 
                  Le Monde Sucré
                </span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-pink-400 to-pink-500 dark:from-pink-500 dark:to-pink-600 group-hover:w-full transition-all duration-300"></span> 
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-pink-500 dark:text-pink-400 mt-0.5 font-light"> 
                de Linda
              </span>
            </Link>
          </div>

          {/* --- Menu Mobile (Sheet) --- */}
          <div className="md:hidden"> 
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-white dark:bg-gray-950 p-4 pt-8">
                <SheetHeader className="mb-4 border-b pb-3 dark:border-gray-800">
                  <SheetTitle className={`text-xl text-gray-800 dark:text-white ${playfairDisplay.className}`}>
                    Le Monde Sucré
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 text-sm"> 
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`block rounded-md px-3 py-2 font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-pink-50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        onClick={() => setSheetOpen(false)} 
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}

                  <Separator className="my-3 dark:bg-gray-700" />

                  {/* Logique d'authentification mobile mise à jour avec useSession */}
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
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
                      )}
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
                       <button 
                         onClick={() => {
                           signIn();
                           setSheetOpen(false);
                         }}
                         className="w-full text-left flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                       >
                         <LogIn className="w-4 h-4" />
                         Connexion
                       </button>
                    </SheetClose>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* --- Fin Menu Mobile (Sheet) --- */}

          {/* Navigation Desktop Principale */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium leading-6 transition-colors duration-200 px-3 py-2 rounded-md ${ 
                  pathname === item.href
                    ? 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* --- Actions Utilisateur Desktop (Dropdown Menu toujours visible) --- */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* Afficher l'image de l'utilisateur si disponible, sinon fallback */}
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "Utilisateur"} />
                    <AvatarFallback>
                      {/* Utiliser User2 si admin, sinon User standard */} 
                      {isAdmin ? <User2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-md">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name ?? 'Utilisateur'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/admin" className="flex items-center gap-2 text-sm">
                          <ShieldCheck className="w-4 h-4 text-gray-500" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {/* Afficher le séparateur seulement si l'admin item est affiché */} 
                    {isAdmin && <DropdownMenuSeparator />}
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => signIn()} className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Connexion</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* L'ancien bouton de connexion explicite est supprimé */}
          </div>
          {/* --- Fin Actions Utilisateur Desktop --- */}
        </div>
      </nav>
    </header>
  );
}