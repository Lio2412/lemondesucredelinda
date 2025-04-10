"use client"; // Nécessaire pour les hooks useState, useEffect, etc.

import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input"; // Ajusté
import { Button } from "@/components/ui/button"; // Ajusté
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la requête échoue
        toast.error("Une erreur est survenue lors de l'inscription.");
      } else {
        // Si la requête réussit
        if (data.message === "Déjà abonné") {
          toast("Email déjà abonné");
        } else {
          toast.success("Merci ! Vous êtes abonné à notre newsletter 🎉");
        }
        setEmail(""); // Vider le champ après succès
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required // Ajoute la validation HTML5 de base
        aria-label="Adresse email pour la newsletter"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  );
}

// Optionnel : Exporter par défaut si c'est la seule exportation
// export default NewsletterForm;