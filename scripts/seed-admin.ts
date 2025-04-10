import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@site.com";
  const passwordPlain = "admin123";
  const name = "Admin";
  const role = "admin";

  console.log(`Préparation de l'upsert pour l'utilisateur : ${email}...`);

  // Hasher le mot de passe
  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  console.log("Mot de passe hashé.");

  // Utiliser upsert : crée l'utilisateur s'il n'existe pas, sinon ne fait rien (car update est vide)
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      // Vous pourriez mettre à jour le mot de passe ou le nom ici si nécessaire
      // name: name,
      // password: passwordHash,
      // role: role,
    },
    create: {
      email: email,
      name: name,
      password: passwordHash,
      role: role,
      // emailVerified peut être défini ici si nécessaire
      // emailVerified: new Date(),
    },
  });

  if (user) {
     console.log(`✅ Utilisateur admin ${email} assuré d'exister (créé ou déjà présent).`);
  } else {
     console.error(`❌ Échec de l'opération upsert pour ${email}.`);
  }
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding de l'admin :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Déconnexion de Prisma.");
  });