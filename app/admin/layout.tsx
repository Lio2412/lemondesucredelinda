'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Utensils, Users, Settings, BarChart3, Sparkles, Mail } from 'lucide-react'; // Suppression de History

// Composant pour la barre latérale (Sidebar)
const AdminSidebar = () => {
  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/recipes', label: 'Recettes', icon: Utensils },
    { href: '/admin/creations', label: 'Créations', icon: Sparkles },
    { href: '/admin/articles', label: 'Articles', icon: BookOpen },
    // { href: '#', label: 'Utilisateurs', icon: Users }, // Supprimé
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 }, // Activé avec le bon lien
    // { href: '#', label: 'Paramètres', icon: Settings }, // Supprimé
  ];

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Logo ou Titre */}
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <Link href="/admin" className="text-xl font-semibold text-gray-800 dark:text-white">
          Admin Panel
        </Link>
      </div>
      {/* Navigation */}
      {/* Navigation - Ajout de flex flex-col items-center pour centrer */}
      <nav className="flex-grow p-4 space-y-2 flex flex-col items-center">
        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            {/* Ajouter un séparateur avant "Analytics" */}
            {item.label === 'Analytics' && (
              <hr className="w-3/4 my-2 border-gray-200 dark:border-gray-600" />
            )}
            <Link
              href={item.href}
              // Appliquer un style différent pour les liens désactivés (si jamais il y en a de nouveau)
              className={`flex flex-col items-center justify-center w-full px-3 py-3 rounded-md text-sm font-medium transition-colors ${ // py-3 pour plus d'espace vertical
                item.href === '#'
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' // Style désactivé
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' // Style actif
              }`}
              // Empêcher la navigation pour les liens désactivés
              onClick={(e) => item.href === '#' && e.preventDefault()}
              aria-disabled={item.href === '#'}
              tabIndex={item.href === '#' ? -1 : undefined}
            >
              {/* Icône centrée */}
              <item.icon className="w-6 h-6 mb-1" /> {/* Taille légèrement augmentée, marge en bas */}
              {/* Texte centré */}
              <span className="text-xs text-center">{item.label}</span> {/* Taille réduite, centré */}
            </Link>
          </React.Fragment>
        ))}
      </nav>
      {/* Pied de la sidebar (optionnel) */}
      <div className="p-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        Mock Admin v1.0
      </div>
    </aside>
  );
};

// Layout principal pour la section Admin
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Note: Ce layout s'applique uniquement aux routes sous /admin
    // Il ne remplace pas le RootLayout principal
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* On pourrait ajouter un Header spécifique à l'admin ici si nécessaire */}
        {/* Ajout de padding-top pour compenser la hauteur du header fixe */}
        <div className="p-6 md:p-8 pt-16 md:pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}