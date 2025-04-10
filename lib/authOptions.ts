import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'; // Correction: utiliser bcryptjs

// Instancier PrismaClient globalement ou via un helper
// Assurez-vous que prisma est correctement initialisé
// import { prisma } from '@/lib/prisma'; // Si vous avez un helper
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Authorize: Email ou mot de passe manquant');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          console.error('Authorize: Utilisateur non trouvé pour email:', credentials.email);
          return null;
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password ?? '');

        if (!isPasswordValid) {
          console.error('Authorize: Mot de passe invalide pour email:', credentials.email);
          return null;
        }

        console.log('Authorize: Authentification réussie pour email:', credentials.email);
        // Retourner l'utilisateur sans le mot de passe
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Après la connexion, ajouter l'ID et le rôle de l'utilisateur au token JWT
      if (user) {
        token.id = user.id;
        // @ts-ignore // Ignorer si le type User n'est pas encore étendu
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter l'ID et le rôle de l'utilisateur à l'objet session
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string; // Assurez-vous que 'role' est bien dans votre modèle User
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Page de connexion personnalisée
    // signOut: '/auth/signout',
    // error: '/auth/error', // Page pour afficher les erreurs (e.g. échec de connexion)
    // verifyRequest: '/auth/verify-request', // Page pour vérifier l'e-mail (si activé)
    // newUser: '/auth/new-user' // Page pour les nouveaux utilisateurs après connexion via OAuth
  },
  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous que cette variable est définie dans .env
  debug: process.env.NODE_ENV === 'development', // Activer le debug en développement
};
