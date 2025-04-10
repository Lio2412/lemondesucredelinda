import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier l'existence des variables d'environnement critiques pour le serveur
if (!supabaseUrl) {
  throw new Error('La variable d\'environnement NEXT_PUBLIC_SUPABASE_URL est manquante.');
}
if (!supabaseAnonKey) {
  throw new Error('La variable d\'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante.');
}

// Initialiser et exporter le client Supabase (pour usage côté client ou serveur avec RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Créer un client Admin pour les opérations serveur nécessitant des privilèges (contourne RLS)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseServiceRoleKey) {
  // Avertissement ou erreur si la clé de service est manquante pour les opérations admin
  console.warn('La variable d\'environnement SUPABASE_SERVICE_ROLE est manquante. Les opérations admin Supabase pourraient échouer.');
}

// Exporter le client Admin (il ne fonctionnera pas si la clé est manquante)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || '');