"use client";

import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "@/app/styles/auth.css"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false); 
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // 🔥 Redirige si déjà connecté
      }
    });

    return () => unsubscribe(); // Nettoie l'écouteur quand le composant est démonté
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Définir la persistance de la session
      await setPersistence(auth, stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); 
    } catch (error) {
      setError("Identifiants incorrects ou problème de connexion.");
      console.error("🚨 Erreur de connexion :", error);
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

        <h2>Connexion</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mot de passe" />
          
          <div className="remember-me">
            <input type="checkbox" id="stayLoggedIn" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />
            <label htmlFor="stayLoggedIn">Rester connecté</label>
          </div>

          <button type="submit">Se connecter</button>
        </form>

        <p>Pas encore de compte ? <Link href="/auth/signup">S&apos;inscrire</Link></p>

        {/* Icônes des réseaux sociaux */}
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-google"></i>
          <i className="fab fa-linkedin"></i>
        </div>
      </div>
    </div>
  );
}
