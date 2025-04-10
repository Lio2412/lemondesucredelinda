'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react'; // Icônes sociales
import { Playfair_Display } from 'next/font/google';

import { NewsletterForm } from './NewsletterForm'; // Ajuste le chemin si nécessaire
// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'], // Poids utilisé pour le logo du footer
  display: 'swap',
});

// Liens de navigation principaux (identiques à ceux du Header)
const mainNavigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Recettes', href: '/recettes' },
  { name: 'Créations', href: '/creations' }, // Ajouté
  { name: 'Blog', href: '/blog' },
  { name: 'À Propos', href: '/a-propos' }, // Décommenté et ajouté
];

// Autres liens (Mentions légales, etc.)
const otherLinks = [
  { name: 'Mentions légales', href: '/mentions-legales' },
  { name: 'Politique de confidentialité', href: '/politique-confidentialite' },
];

export default function Footer() {

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"> {/* Rétablissement: Fond clair (gray-50) */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Grille principale à 2 colonnes sur lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonne 1: Logo, Description, Social */}
          <div> {/* Prend 1 colonne par défaut */}
            {/* Logo */}
            <Link href="/" className={`inline-block text-2xl font-light text-gray-800 dark:text-white mb-4 ${playfairDisplay.className}`}> {/* Rétablissement: Logo texte sombre */}
              Le Monde Sucré
              <span className="block text-xs tracking-[0.1em] uppercase text-pink-500 dark:text-pink-400 font-light -mt-1">
                de Linda
              </span>
            </Link>
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6"> {/* Rétablissement: Description texte standard */}
              Partage de la pâtisserie française à travers des recettes authentiques, des conseils et des histoires gourmandes.
            </p>
            {/* Icônes Sociales */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/p/Le-monde-sucr%C3%A9-de-Linda-61550904490051/" // Lien Facebook mis à jour
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" // Rétablissement: Icône sociale couleur standard
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/le_mondesucre_de_linda/" // Lien Instagram mis à jour
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" // Rétablissement: Icône sociale couleur standard
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            {/* Section Newsletter */}
            <div className="mt-8"> {/* Ajoute un peu d'espace au-dessus */}
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Restez informé !</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Abonnez-vous à notre newsletter.</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Colonne 2: Contient la grille imbriquée pour Navigation et Informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"> {/* Grille imbriquée */}
            {/* Colonne Navigation (dans la grille imbriquée) */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">Navigation</h3>
              <ul className="space-y-2">
                {mainNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne Informations (dans la grille imbriquée) */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">Informations</h3>
              <ul className="space-y-2">
                {otherLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-sm transition-colors ${item.href === '#' ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'}`}
                      onClick={(e) => item.href === '#' && e.preventDefault()}
                      aria-disabled={item.href === '#'}
                      tabIndex={item.href === '#' ? -1 : undefined}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                 <li>
                    <Link
                      href="/contact"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Ligne de Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400"> {/* Rétablissement: Copyright texte standard */}
          <p>&amp;copy; {new Date().getFullYear()} Le Monde Sucré de Linda. Tous droits réservés.</p>
          {/* Optionnel: Ajouter un lien vers le créateur ou autre */}
        </div>
      </div>
    </footer>
  );
}