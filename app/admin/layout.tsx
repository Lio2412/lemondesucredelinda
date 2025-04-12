'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Utensils, Users, Settings, BarChart3, Sparkles, Mail } from 'lucide-react'; 

// Composant pour la barre de navigation mobile
const MobileAdminNav = () => {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/recipes', label: 'Recettes', icon: Utensils },
    { href: '/admin/creations', label: 'Créations', icon: Sparkles },
    { href: '/admin/articles', label: 'Articles', icon: BookOpen },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex items-center justify-around lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center justify-center text-xs font-medium transition-colors p-2 rounded-md ${
            item.href === '#'
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={(e) => item.href === '#' && e.preventDefault()}
          aria-disabled={item.href === '#'} 
          tabIndex={item.href === '#' ? -1 : undefined}
        >
          <item.icon className="w-5 h-5 mb-0.5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

// Layout principal pour la section Admin - Version Responsive
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/recipes', label: 'Recettes', icon: Utensils },
    { href: '/admin/creations', label: 'Créations', icon: Sparkles },
    { href: '/admin/articles', label: 'Articles', icon: BookOpen },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 flex-col hidden lg:flex">
        <div className="h-16 flex items-center justify-center border-b dark:border-gray-700 shrink-0">
          <Link href="/admin" className="text-xl font-semibold text-gray-800 dark:text-white">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              {item.label === 'Analytics' && (
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
              )}
              <Link
                href={item.href}
                className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  item.href === '#'
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={(e) => item.href === '#' && e.preventDefault()}
                aria-disabled={item.href === '#'} 
                tabIndex={item.href === '#' ? -1 : undefined}
              >
                <item.icon className="w-5 h-5 mr-3 shrink-0" />
                <span className="truncate">{item.label}</span> 
              </Link>
            </React.Fragment>
          ))}
        </nav>
        <div className="p-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 shrink-0">
          Mock Admin v1.0
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 pt-16 md:pt-20 pb-20 lg:pb-8">
          {children}
        </div>
      </main>

      <MobileAdminNav />
    </div>
  );
}