'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { motion } from 'framer-motion';

// Instancier la police Playfair Display (copié depuis app/page.tsx)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Fond dégradé subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texte d'introduction */}
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="inline-block text-sm tracking-wider text-pink-600 mb-6">BIENVENUE</span>
            {/* Titre principal avec police Playfair Display et animation */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`text-4xl md:text-5xl font-light mb-6 text-gray-900 ${playfairDisplay.className}`}
            >
              Le Monde Sucré
              <span className="block text-2xl md:text-3xl text-pink-600 mt-2">de Linda</span>
            </motion.h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez l'art de la pâtisserie française à travers des recettes authentiques et élégantes
            </p>
            {/* Bouton d'appel à l'action */}
            <Link
              href="/recettes"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-300"
            >
              Explorer nos recettes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          {/* Image principale */}
          <div className="relative md:order-2">
            <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/Header.png"
                alt="Pâtisserie élégante"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
            </div>
            {/* Éléments décoratifs */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}