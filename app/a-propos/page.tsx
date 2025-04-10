'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedHeading from '@/components/ui/AnimatedHeading';
import { Dancing_Script } from 'next/font/google'; // Import de la police

// Instanciation de la police pour la signature
const script = Dancing_Script({ subsets: ['latin'], weight: '400' });

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-12" // Conserver le conteneur principal
    >
      {/* Conserver le titre animé */}
      <AnimatedHeading as="h1" className="text-center mb-12">
        À propos
      </AnimatedHeading>

      {/* Réinsertion de la section image */}
      <section className="mb-12 flex justify-center">
        {/* Conteneur pour l'image animée */}
        {/* Ajustement de la taille du conteneur à w-40 h-40 */}
        <div className="w-40 h-40 rounded-full bg-white overflow-hidden shadow-xl mx-auto"> {/* Utilisation de shadow-xl et mx-auto comme demandé */}
          <motion.div // Utilisation de motion.div pour animer l'image à l'intérieur
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
             className="w-full h-full" // Assure que la div animée prend toute la place
          >
            <Image
              src="/images/about-profile.jpg"
              alt="Portrait de Linda"
              width={160} // Correspond à w-40
              height={160} // Correspond à h-40
              className="object-cover w-full h-full" // L'image remplit toujours le conteneur
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Nouveau contenu personnalisé */}
      {/* Ajout de text-lg pour augmenter la taille du texte */}
      <div className="prose prose-pink text-lg max-w-3xl mx-auto px-4 mt-8 space-y-6 text-justify">
        <p>
          Je m'appelle <strong>Linda</strong>, passionnée de pâtisserie depuis toujours. Ce blog est né de mon envie de partager <em>des recettes authentiques, élégantes et accessibles à tous</em>, inspirées par la tradition française mais aussi par mon imaginaire gourmand.
        </p>
        <p>
          Pour moi, la pâtisserie est bien plus qu’un simple plaisir sucré. C’est un <em>moment de douceur</em>, un <em>rituel créatif</em>, une <em>façon de faire plaisir</em> aux gens que l’on aime. Chaque recette raconte une histoire, un souvenir d’enfance, une envie de saison, ou une émotion à faire fondre.
        </p>
        <p>
          Avec <strong>Le Monde Sucré de Linda</strong>, je souhaite :
        </p>
        {/* La liste est maintenant un élément frère du paragraphe */}
        <ul className="list-disc list-inside my-2">
          <li>Transmettre ma passion à travers des recettes détaillées et inspirantes</li>
          <li>Partager mes petites astuces de pâtissière maison</li>
          <li>Proposer un espace chaleureux, sans pression, juste pour le plaisir de créer</li>
        </ul>
        <p>
          Ce que vous trouverez ici :
        </p>
        {/* La liste est maintenant un élément frère du paragraphe */}
        <ul className="list-disc list-inside my-2">
          <li>Des recettes de gâteaux, tartes, biscuits et douceurs variées</li>
          <li>Des idées créatives pour vos fêtes ou goûters</li>
          <li>Des créations personnelles à déguster… des yeux et du cœur</li>
        </ul>
      </div>

      {/* Citation avec fond */}
      <div className="bg-pink-50 rounded-xl py-4 px-6 mt-12 max-w-2xl mx-auto">
        <blockquote className="italic text-center text-muted-foreground mb-0"> {/* mb-0 pour éviter double marge */}
          “La gourmandise commence là où la raison s’arrête.”
        </blockquote>
      </div>

      {/* Signature stylisée */}
      <p className={`text-center mt-4 text-pink-600 text-xl italic ${script.className}`}>
        — Linda
      </p>
    </motion.div>
  );
}