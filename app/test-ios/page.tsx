'use client';

import { useState } from 'react';
import { IOSImageUpload } from '@/components/ui/ios-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Smartphone, Monitor } from 'lucide-react';

export default function TestIOSPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [debugMode, setDebugMode] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const result = `✅ Fichier sélectionné: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    setTestResults(prev => [...prev, result]);
  };

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  const clearResults = () => {
    setTestResults([]);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Test Upload iOS</h1>
        <p className="text-muted-foreground">
          Interface de test pour diagnostiquer et résoudre les problèmes d'upload d'images sur iOS
        </p>
      </div>

      {/* Détection de l'environnement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isIOS ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            Détection de l'environnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Plateforme:</span>
            <Badge variant={isIOS ? "default" : "secondary"}>
              {isIOS ? "iOS" : "Autre"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Navigateur:</span>
            <Badge variant={isSafari ? "default" : "outline"}>
              {isSafari ? "Safari" : "Autre"}
            </Badge>
          </div>
          {typeof navigator !== 'undefined' && (
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">User Agent</summary>
              <div className="mt-2 p-2 bg-muted rounded font-mono text-xs break-all">
                {navigator.userAgent}
              </div>
            </details>
          )}
        </CardContent>
      </Card>

      {/* Statut du test */}
      {isIOS ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Parfait ! Vous êtes sur iOS. Cette interface est optimisée pour votre appareil.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'êtes pas sur iOS. Pour tester complètement, utilisez un iPhone ou iPad avec Safari.
          </AlertDescription>
        </Alert>
      )}

      {/* Interface de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Test d'Upload d'Image
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? 'Masquer Debug' : 'Afficher Debug'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IOSImageUpload
            onImageSelect={handleImageSelect}
            debugMode={debugMode}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Résultats des Tests
            <Button variant="outline" size="sm" onClick={clearResults}>
              Effacer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun test effectué. Sélectionnez une image pour commencer.
            </p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions de Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Pour iOS (iPhone/iPad) :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Utilisez Safari pour les meilleurs résultats</li>
              <li>Testez avec des photos prises avec l'appareil photo</li>
              <li>Testez avec des images de la galerie</li>
              <li>Vérifiez que le mode debug affiche les bonnes informations</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Fonctionnalités testées :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Détection automatique d'iOS</li>
              <li>Attribut accept simplifié (image/* uniquement)</li>
              <li>Validation permissive pour les types de fichiers</li>
              <li>Interface adaptée avec bouton caméra</li>
              <li>Diagnostic intégré visible dans l'UI</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}