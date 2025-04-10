import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { JWT } from "next-auth/jwt"

// Ce middleware étend le middleware `withAuth` de NextAuth
export default withAuth(
  // `withAuth` exécute la fonction `authorized` et redirige si elle retourne `false`
  // ou si une erreur se produit.
  function middleware(req: NextRequest & { nextauth: { token: JWT | null } }) {
    // Ici, vous pouvez ajouter une logique supplémentaire si nécessaire après l'authentification.
    // Par exemple, vérifier des permissions spécifiques basées sur le token.
    // console.log("Token in middleware:", req.nextauth.token)

    // Si l'utilisateur est authentifié (autorisé par `authorized` ci-dessous),
    // on laisse la requête passer.
    return NextResponse.next()
  },
  {
    callbacks: {
      // Cette fonction détermine si l'utilisateur est autorisé à accéder aux routes protégées.
      // Elle est appelée AVANT la fonction `middleware` ci-dessus.
      authorized: ({ token }) => {
        // L'utilisateur est autorisé si le token existe ET si son rôle est "admin".
        // Le rôle est ajouté au token via le callback `session` dans la config NextAuth.
        // Note: Pour que `token.role` fonctionne, il faut aussi configurer le callback `jwt`
        // dans `authOptions` si vous utilisez la stratégie JWT (par défaut).
        // L'adaptateur Supabase utilise des sessions DB par défaut, mais il est bon de le savoir.
        // Avec les sessions DB, `token` peut être null ou contenir les infos de la session DB.
        // La vérification `token?.role === "admin"` devrait fonctionner si le callback `session`
        // est correctement configuré pour ajouter le rôle.
        return token?.role === "admin"
      },
    },
    // Rediriger vers la page de connexion personnalisée si l'utilisateur n'est pas autorisé
    // ou si une erreur se produit pendant l'autorisation.
    pages: {
      signIn: '/login', // Notre page de connexion personnalisée
      error: '/login', // Rediriger vers login aussi en cas d'erreur (ex: token invalide)
    }
  }
)

// Spécifie quelles routes doivent être protégées par ce middleware.
export const config = {
  matcher: ["/admin/:path*"], // Protège toutes les routes sous /admin/
}