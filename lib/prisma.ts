import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Déclare une variable globale pour stocker l'instance de PrismaClient
// afin qu'elle ne soit pas recréée à chaque rechargement à chaud en développement.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Fonction pour créer une instance de base PrismaClient
const createPrismaClient = () => new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
  errorFormat: 'pretty',
  log: ['error', 'warn'],
});

// Fonction pour créer une instance de PrismaClient avec Accelerate
const createAcceleratedClient = () => createPrismaClient().$extends(withAccelerate());

// Détermine quel client utiliser
// Utilise Accelerate si l'URL commence par prisma://, sinon client standard
const client = process.env.DATABASE_URL?.startsWith('prisma://') 
  ? createAcceleratedClient()
  : createPrismaClient();

// Initialise PrismaClient. En production, crée une nouvelle instance.
// En développement, réutilise l'instance globale si elle existe, sinon en crée une.
export const prisma = global.prisma || client;

// Si nous sommes en développement, assigne l'instance créée à la variable globale.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma as any; // Garder le 'as any' pour le cache dev
}