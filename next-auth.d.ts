import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Étend l'interface Session par défaut.
   */
  interface Session {
    user: {
      role?: string | null;
      id?: string | null;
    } & DefaultSession["user"]; // Fusionne avec les propriétés utilisateur par défaut
  }

  /**
   * Étend l'interface User par défaut.
   */
  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Étend l'interface JWT par défaut.
   */
  interface JWT extends DefaultJWT {
    role?: string | null;
    id?: string | null;
  }
}