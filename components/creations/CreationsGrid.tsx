'use client'; // Ce composant est un Client Component

import CreationCard from '@/components/creations/CreationCard';
import { Creation } from '@/types'; // Importer depuis le fichier global de types
import { motion } from 'framer-motion';

interface CreationsGridProps {
  creations: Creation[];
}

const CreationsGrid = ({ creations }: CreationsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {creations.map((creation, index) => (
        // Envelopper chaque carte dans motion.div pour l'animation d'entrée
        <motion.div
          key={creation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.08 }} // Durée et délai ajustés pour fluidité
        >
          <CreationCard creation={creation} />
        </motion.div>
      ))}
    </div>
  );
};

export default CreationsGrid;