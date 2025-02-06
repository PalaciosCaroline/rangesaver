"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "./authContext"; 
import Image from "next/image";
import logo from "@/public/images/logo.png"; 

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 📌 Logo */}
        <Link href="/" className="logo">
          <Image src={logo} alt="Logo" width={50} height={50} />
        </Link>

        {/* 📌 Liens principaux */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link href="/create-range">Créer une range</Link></li>
          <li><Link href="/my-ranges">Voir ses ranges</Link></li>
          <li><Link href="/training">S&apos;entraîner</Link></li>
        </ul>

        {/* 📌 Bouton Connexion/Déconnexion */}
        <div className="auth-button">
          {loading ? (
            <span>Chargement...</span> // ✅ Affiche un indicateur en attendant le chargement
          ) : user ? (
            <button onClick={logout}>Déconnexion</button> // ✅ Utilise la fonction `logout`
          ) : (
            <Link href="/auth/login">
              <button>Connexion</button>
            </Link>
          )}
        </div>

        {/* 📌 Menu burger en mobile */}
        <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
      </div>
    </nav>
  );
}
