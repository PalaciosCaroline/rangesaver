"use client";
import React, { useState,  useMemo  } from "react";
import Link from "next/link";
import { useAuth } from "./authContext"; 
import Image from "next/image";
import logo from "@/public/images/logo.png"; 

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

   // ✅ Empêche le re-render inutile de la navbar
   const authButton = useMemo(() => {
    if (loading) return <span>Chargement...</span>;
    return user ? (
      <button onClick={logout}>Déconnexion</button>
    ) : (
      <Link href="/auth/login">
        <button>Connexion</button>
      </Link>
    );
  }, [user, loading]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 📌 Logo */}
        <Link href="/" className="logo">
          <Image src={logo} alt="Logo" width={50} height={50} />
        </Link>

        {/* 📌 Liens principaux */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li><Link href="/handmatrix">Créer un range</Link></li> 
            <li><Link href="/my-ranges">Voir ses ranges</Link></li>
            <li><Link href="/training">S&apos;entraîner</Link></li>
        </ul>

        {/* 📌 Bouton Connexion/Déconnexion */}
        <div className="auth-button">
          {authButton}
        </div>

        {/* 📌 Menu burger en mobile */}
        <div className={`burger-menu ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
      </div>
    </nav>
  );
}
