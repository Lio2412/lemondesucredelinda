'use client';

import React from 'react';
import { Loading } from './loading';
import { motion } from 'framer-motion';

interface PageLoadingProps {
  isRouteChanging: boolean;
  loadingKey: string;
}

export function PageLoading({ isRouteChanging, loadingKey }: PageLoadingProps) {
  return (
    <>
      {/* Indicateur de chargement plein écran pour les transitions de page */}
      {isRouteChanging && (
        <motion.div
          key={loadingKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-50"
        >
          <Loading size="lg" fullScreen={false} text="Chargement de la page..." />
        </motion.div>
      )}
    </>
  );
}