"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "@/app/styles/auth.css"; 

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("🚨 Remplis tous les champs.");
      return;
    }

    console.log("📌 Tentative d'inscription avec :", email, password);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Utilisateur créé :", userCredential.user);

      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      console.error("🚨 Erreur d'inscription :", error.code, error.message);
      
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("🚨 Cet email est déjà utilisé.");
          break;
        case "auth/invalid-email":
          setError("🚨 Email invalide.");
          break;
        case "auth/weak-password":
          setError("🚨 Mot de passe trop court (min. 6 caractères).");
          break;
        default:
          setError("🚨 Une erreur s'est produite. Réessaie.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-image-container">
          <Image 
            src="/images/poisson_globe.png" 
            alt="Connexion"
            fill
            className="auth-image"
            priority 
          />
        </div>

        <h2>Créer un compte</h2>
        {error && <p className="auth-error">{error}</p>}
        
        <form onSubmit={handleSignup}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Email"
            autoComplete="email"
          />

          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Mot de passe"
            autoComplete="new-password"
          />

          <button type="submit">S&apos;inscrire</button>
        </form>

        <p>Déjà un compte ? <Link href="/auth/login">Se connecter</Link></p>
      </div>
    </div>
  );
}
