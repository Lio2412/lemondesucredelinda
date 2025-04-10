'use client'; // Marquer ce composant comme un Client Component

    import { SessionProvider } from 'next-auth/react';
    import React from 'react';

    interface NextAuthProviderProps {
      children: React.ReactNode;
      // Vous pouvez ajouter d'autres props si nécessaire, par exemple pour passer la session initiale
      // session?: Session | null;
    }

    export default function NextAuthProvider({ children }: NextAuthProviderProps) {
      // Le SessionProvider enveloppe les enfants et fournit le contexte de session
      return <SessionProvider>{children}</SessionProvider>;
    }