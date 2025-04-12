'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react'; // Importer les icônes

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour la visibilité MDP
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/admin'); // Redirection vers le dashboard admin en cas de succès
      } else {
        setError('Email ou mot de passe incorrect'); // Message d'erreur générique
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center p-4 animate-fadeIn"> {/* Conteneur pour centrer dans le main du RootLayout */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      {/* Le style fadeIn peut être appliqué globalement ou via Tailwind si nécessaire */}
      {/* Carte claire avec ombre légère */}
      <Card className="w-full max-w-md shadow-lg bg-white rounded-lg border border-pink-100">
        <CardHeader>
          {/* Texte sombre */}
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Connexion</CardTitle>
          <CardDescription className="text-center text-gray-500">Accédez à votre espace personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 placeholder-gray-400" // Style input clair
              />
            </div>
            {/* Mettre le label et le champ mot de passe dans un div relatif */}
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Type dynamique
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                // Ajouter un padding à droite pour ne pas superposer l'icône
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 pr-10 placeholder-gray-400" 
              />
              {/* Bouton pour afficher/masquer */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-[28px] h-7 w-7 px-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" // Ajuster top si label prend plus de place
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {/* Bouton avec les couleurs primaires (supposant rose/gris) */}
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white" disabled={isLoading}>
              {isLoading ? 'Connexion en cours...' : 'Connexion'}
            </Button>
          </form>
        </CardContent>
        {/* Footer de la carte (peut être vide ou contenir des liens) */}
        <CardFooter className="text-center text-sm text-gray-500 pt-4">
          {/* Optionnel: Ajouter un lien "Mot de passe oublié ?" ou "S'inscrire" ici */}
        </CardFooter>
      </Card>
    </div>
  );
}