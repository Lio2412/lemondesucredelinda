import { PrismaClient } from '@prisma/client'

// Déclare une variable globale pour stocker l'instance de PrismaClient
// afin qu'elle ne soit pas recréée à chaque rechargement à chaud en développement.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Initialise PrismaClient. En production, crée une nouvelle instance.
// En développement, réutilise l'instance globale si elle existe, sinon en crée une.
export const prisma =
  global.prisma ||
  new PrismaClient({
    // Optionnel: active les logs Prisma si nécessaire
    // log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      },
    },
    // Ajouter ces options pour améliorer la fiabilité de la connexion
    // dans des environnements serverless comme Netlify
    errorFormat: 'pretty',
    log: ['error', 'warn'],
    // Réduire le nombre de connexions simultanées
    connection_limit: 5,
  })

// Si nous sommes en développement, assigne l'instance créée à la variable globale.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}