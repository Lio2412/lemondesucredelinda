'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface IOSImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  debugMode?: boolean;
  className?: string;
}

interface DiagnosticInfo {
  isIOS: boolean;
  userAgent: string;
  supportedTypes: string[];
  browserName: string;
  isSafari: boolean;
}

export function IOSImageUpload({ 
  onImageSelect, 
  currentImage, 
  debugMode = false,
  className = "" 
}: IOSImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Détection iOS et diagnostic (avec vérification SSR)
  const detectEnvironment = (): DiagnosticInfo => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        isIOS: false,
        userAgent: 'SSR',
        supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
        browserName: 'SSR',
        isSafari: false
      };
    }

    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    
    let browserName = 'Inconnu';
    if (isSafari) browserName = 'Safari';
    else if (/Chrome/.test(userAgent)) browserName = 'Chrome';
    else if (/Firefox/.test(userAgent)) browserName = 'Firefox';

    return {
      isIOS,
      userAgent,
      supportedTypes: isIOS ? ['image/*'] : ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
      browserName,
      isSafari
    };
  };

  // Gestionnaire d'upload avec fallbacks iOS
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const env = detectEnvironment();
    setDiagnostics(env);

    if (!file) {
      setUploadStatus('idle');
      return;
    }

    // Log de diagnostic détaillé
    if (debugMode) {
      console.log('[iOS Image Upload] Diagnostic complet:', {
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString()
        },
        environment: env,
        timestamp: new Date().toISOString()
      });
    }

    // Validation adaptée à l'environnement
    let isValid = false;
    let validationMessage = '';

    if (env.isIOS) {
      // Validation très permissive pour iOS
      isValid = file.type === '' || 
                file.type.startsWith('image/') || 
                /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);
      
      if (!isValid) {
        validationMessage = `Fichier non reconnu comme image sur iOS. Nom: ${file.name}, Type: ${file.type || 'non détecté'}`;
      }
    } else {
      // Validation standard pour autres plateformes
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
      isValid = acceptedTypes.includes(file.type) || file.type.startsWith('image/');
      
      if (!isValid) {
        validationMessage = `Type de fichier non supporté: ${file.type}. Types acceptés: ${acceptedTypes.join(', ')}`;
      }
    }

    if (isValid) {
      setSelectedFile(file);
      setUploadStatus('success');
      setErrorMessage('');
      onImageSelect(file);
    } else {
      setUploadStatus('error');
      setErrorMessage(validationMessage);
      setSelectedFile(null);
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Gestionnaire pour le mode iOS simplifié
  const handleIOSModeClick = () => {
    if (fileInputRef.current) {
      // Pour iOS, on utilise l'attribut capture pour accéder à la caméra
      fileInputRef.current.click();
    }
  };

  const env = diagnostics || detectEnvironment();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Interface d'upload adaptée */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={env.isIOS ? "image/*" : "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"}
          onChange={handleFileSelect}
          className="hidden"
          id="ios-image-upload"
        />
        
        {env.isIOS ? (
          // Interface spéciale iOS
          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleIOSModeClick}
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Prendre une photo ou choisir une image
            </Button>
          </div>
        ) : (
          // Interface standard
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choisir une image
          </Button>
        )}
      </div>

      {/* Statut de l'upload */}
      {uploadStatus === 'success' && selectedFile && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Image sélectionnée: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Image actuelle */}
      {currentImage && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Image actuelle:</p>
          <img 
            src={currentImage} 
            alt="Image actuelle" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Mode Debug */}
      {debugMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4" />
              Diagnostic iOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Plateforme:</span>
                <Badge variant={env.isIOS ? "default" : "secondary"} className="ml-2">
                  {env.isIOS ? "iOS" : "Autre"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Navigateur:</span>
                <Badge variant="outline" className="ml-2">{env.browserName}</Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium text-xs">Types acceptés:</p>
              <div className="flex flex-wrap gap-1">
                {env.supportedTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedFile && (
              <div className="space-y-1">
                <p className="font-medium text-xs">Fichier sélectionné:</p>
                <div className="bg-muted p-2 rounded text-xs font-mono">
                  <div>Nom: {selectedFile.name}</div>
                  <div>Type: {selectedFile.type || 'non détecté'}</div>
                  <div>Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
            )}

            <details className="text-xs">
              <summary className="cursor-pointer font-medium">User Agent</summary>
              <div className="mt-1 bg-muted p-2 rounded font-mono break-all">
                {env.userAgent}
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}