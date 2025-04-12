import { PrismaClient } from '@prisma/client'

// Déclare une variable globale pour stocker l'instance de PrismaClient en développement
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // En production, toujours créer une nouvelle instance simple
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      },
    },
    errorFormat: 'pretty',
    log: ['error', 'warn'],
  });
} else {
  // En développement, utilise l'instance globale si elle existe
  if (!global.prisma) {
    // Sinon, crée une nouvelle instance simple et la stocke globalement
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        },
      },
      errorFormat: 'pretty',
      log: ['error', 'warn'],
    });
  }
  prisma = global.prisma;
}

export { prisma };