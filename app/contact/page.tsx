'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'; // Ajouter CheckCircle
import { Playfair_Display } from 'next/font/google';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importer les composants Select
import { motion } from 'framer-motion'; // Importer motion
// import { useToast } from '@/hooks/use-toast'; // Remplacé par sonner
import { toast } from 'sonner'; // Importer toast de sonner

// Instancier la police Playfair Display
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function ContactPage() {
  // État pour gérer les valeurs du formulaire (sans soumission)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    honeypot: '', // Champ Honeypot
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { toast } = useToast(); // Remplacé par l'import direct de sonner
  // Gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gérer le changement pour le composant Select
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
  };

  // Gérer la soumission réelle du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Votre message a bien été envoyé ! Merci pour votre retour.", {
          icon: <CheckCircle className="w-4 h-4" />,
        });
        // Réinitialiser le formulaire
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        // Gérer les erreurs spécifiques renvoyées par l'API ou une erreur générique
        toast.error(result.error || "Une erreur est survenue. Merci de réessayer plus tard.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Erreur réseau. Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 md:pt-32"> {/* Déplacer le padding top ici */}
      {/* Section Titre harmonisée */}
      <section className="mb-12 text-center"> {/* Utilisation de section et mb-12 */}
         {/* Container ajouté pour englober le max-w */}
         {/* Note: Le container global de la page est déjà présent dans le layout, on ajoute juste le max-w */}
         <div className="max-w-3xl mx-auto px-4"> {/* Conteneur max-width et padding comme sur /recettes */}
            {/* Titre de la page */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              // Classes harmonisées (retrait font-bold)
              className={`text-4xl md:text-5xl text-gray-900 dark:text-white mb-6 ${playfairDisplay.className}`}
            >
              Contactez-moi
            </motion.h1>
            {/* Séparateur ajouté */}
            <div className="w-20 h-px bg-pink-600 dark:bg-pink-500 mx-auto mb-6"></div>
            {/* Paragraphe de description (style harmonisé) */}
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Une question, une suggestion ou une demande de collaboration ? N'hésitez pas à me laisser un message !
            </p>
         </div>
      </section>

      {/* Section Informations de Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Ajustement pour centrer la carte unique */}
          <div className="flex justify-center mb-16">
            {/* Tableau réduit à l'élément Email */}
            {[
              {
                icon: Mail,
                title: "Email",
                info: "Linda.rassegna@hotmail.be",
                description: "Réponse généralement sous 48h"
              }
            // Les éléments Téléphone et Localisation ont été supprimés
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-pink-100 dark:bg-pink-900/50">
                  <item.icon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{item.info}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Section Formulaire de Contact */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md border dark:border-gray-700">
             <h2 className={`text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white ${playfairDisplay.className}`}>Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs Nom et Email */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Votre adresse email"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
              {/* Champ Honeypot caché */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Ne pas remplir ce champ</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

                </div>
              </div>

              {/* Champ Sujet (Select) */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <Select name="subject" value={formData.subject} onValueChange={handleSelectChange} required>
                  <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="question" className="dark:text-white dark:focus:bg-gray-700">Question générale</SelectItem>
                    <SelectItem value="collaboration" className="dark:text-white dark:focus:bg-gray-700">Proposition de collaboration</SelectItem>
                    <SelectItem value="recette" className="dark:text-white dark:focus:bg-gray-700">Question sur une recette</SelectItem>
                    <SelectItem value="autre" className="dark:text-white dark:focus:bg-gray-700">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Champ Message (Textarea) */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Votre message ici..."
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Bouton d'envoi (simulé) */}
              <Button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 ${isSubmitting ? 'animate-pulse' : ''}`} // Ajouter animate-pulse si isSubmitting
                disabled={isSubmitting} // Désactiver pendant la soumission
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </Button>
              {/* Le paragraphe de note est supprimé car le formulaire est maintenant fonctionnel */}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}