import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Instancier Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log(`Début du seeding ...`);

  const newAdminEmail = 'linda.rassegna@hotmail.be';
  // !! REMPLACEZ CECI PAR LE VRAI MOT DE PASSE AVANT D'EXÉCUTER !!
  const plainPassword = 'Lilouu??'; // <-- Mettez 'Lilouu??' ici



  // Hacher le mot de passe
  const hashedPassword = bcrypt.hashSync(plainPassword, 10); // 10 = salt rounds

  try {
    // Créer ou mettre à jour l'utilisateur admin
    const adminUser = await prisma.user.upsert({
      where: { email: newAdminEmail },
      update: {
        password: hashedPassword,
        name: 'Linda Rassegna', // Met à jour le nom aussi si l'utilisateur existe
      },
      create: {
        email: newAdminEmail,
        password: hashedPassword,
        name: 'Linda Rassegna', // Nom pour le nouvel utilisateur
        // Le rôle est 'admin' par défaut selon le schéma
      },
    });
    console.log(`Utilisateur admin créé ou mis à jour : ${adminUser.email}`);
  } catch (error) {
    console.error("Erreur lors de la création/mise à jour de l'utilisateur:", error);
    process.exit(1); // Arrête le script en cas d'erreur Prisma
  }

  console.log(`Seeding terminé.`);
}

main()
  .catch((e) => {
    console.error("Erreur inattendue dans le script de seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Fermer la connexion Prisma
    await prisma.$disconnect();
    console.log("Connexion Prisma fermée.");
  });
