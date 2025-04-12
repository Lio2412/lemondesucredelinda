import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Déclare une variable globale pour stocker l'instance de PrismaClient en développement
declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined
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

let prisma: any;

if (process.env.NODE_ENV === 'production') {
  // En production, toujours créer une nouvelle instance
  // Utilise Accelerate si l'URL commence par prisma://
  prisma = process.env.DATABASE_URL?.startsWith('prisma://')
    ? createAcceleratedClient()
    : createPrismaClient();
} else {
  // En développement, utilise l'instance globale si elle existe
  if (!global.prisma) {
    // Sinon, crée une nouvelle instance (accélérée ou non) et la stocke globalement
    global.prisma = process.env.DATABASE_URL?.startsWith('prisma://')
      ? createAcceleratedClient()
      : createPrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };