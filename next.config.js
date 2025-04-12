/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Configuration par défaut, peut être ajustée
  images: {
    minimumCacheTTL: 60, // Re-valider les images toutes les 60 secondes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '', // Laisser vide pour le port par défaut (443 pour https)
        pathname: '/**',
      },
      // Ajouter le hostname de Supabase Storage
      {
        protocol: 'https',
        hostname: 'pbqkgspugfjyrgkrciln.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Autoriser les chemins du storage public
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;