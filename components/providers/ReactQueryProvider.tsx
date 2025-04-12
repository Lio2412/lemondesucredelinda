'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  // Utilise useState pour s'assurer que QueryClient n'est créé qu'une seule fois
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Options de requête par défaut (optionnel)
            staleTime: 60 * 1000, // Données considérées fraîches pendant 1 minute
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
