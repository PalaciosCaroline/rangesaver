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

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); 
    } catch (error) {
      setError("Erreur lors de l'inscription.");
      console.error("🚨 Erreur d'inscription :", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <div className="auth-image-container">
  <Image 
    src="/images/poisson_globe.png" 
    alt="Connexion"
    fill  // ✅ Utilisation de `fill` pour un ajustement automatique
    className="auth-image"
    priority 
  />
</div>

        <h2>Créer un compte</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSignup}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mot de passe" />
          <button type="submit">S&apos;inscrire</button>
        </form>
        <p>Déjà un compte ? <Link href="/auth/login">Se connecter</Link></p>
      </div>
    </div>
  );
}
