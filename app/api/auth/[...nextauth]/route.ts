import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // Le nom à afficher sur le formulaire de connexion (si vous utilisez la page par défaut)
      name: "Credentials",
      // Les `credentials` sont utilisés pour générer un formulaire sur la page de connexion par défaut.
      // Vous pouvez spécifier tout champ que vous attendez ici.
      // Ils ne sont PAS utilisés pour valider la requête si vous fournissez votre propre page de connexion.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@site.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Logique pour rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && credentials?.password) {
          // Vérifier le mot de passe
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (isValid && user.role === "admin") {
            // Retourner l'objet utilisateur si les identifiants sont valides ET que le rôle est admin
            // Ne retournez que les champs nécessaires, évitez de retourner le mot de passe !
            return { id: user.id, name: user.name, email: user.email, role: user.role };
          }
        }
        // Retourner null si l'utilisateur n'est pas trouvé ou si les identifiants sont invalides
        return null;
      }
    })
  ],
  // La page de connexion par défaut de NextAuth sera utilisée si `pages.signIn` n'est pas défini.
  // Elle enverra une requête POST à cette route avec les credentials.
  pages: {
    signIn: '/login', // Utiliser notre page de connexion personnalisée
  },
  session: {
    // Utiliser JWT pour la session car CredentialsProvider ne persiste pas les sessions DB par défaut
    strategy: "jwt",
  },
  callbacks: {
    // Le callback jwt est appelé lorsque le token JWT est créé ou mis à jour.
    // Nous ajoutons le rôle au token ici pour qu'il soit disponible via useSession/getSession.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // Ajouter l'ID utilisateur au token si nécessaire
      }
      return token;
    },
    // Le callback session est appelé lorsque la session est accédée côté client.
    // Nous ajoutons le rôle et l'ID depuis le token JWT vers l'objet session.
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore // Ajout de propriétés personnalisées à la session/user
        session.user.role = token.role;
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous que NEXTAUTH_SECRET est défini dans .env.local
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };