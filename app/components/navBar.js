"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "./authContext"; 
import Image from "next/image";
import logo from "@/public/images/logo.png"; 

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Cacher la Navbar si l'utilisateur n'est pas connecté et que le chargement est terminé
  if (!loading && !user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 📌 Logo */}
        <Link href="/" className="logo">
          <Image src={logo} alt="Logo" width={50} height={50} />
        </Link>

        {/* 📌 Liens principaux + Déconnexion en mobile */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link href="/handmatrix">Créer un range</Link></li> 
          <li><Link href="/my-ranges">Voir ses ranges</Link></li>
          <li><Link href="/training">S&apos;entraîner</Link></li>
          
          {/* 📌 Bouton Déconnexion en version mobile */}
          {user && (
            <li className="logout-mobile">
              <button onClick={logout}>Déconnexion</button>
            </li>
          )}
        </ul>

        {/* 📌 Bouton Déconnexion en version desktop */}
        {user && (
          <div className="auth-button">
            <button onClick={logout}>Déconnexion</button>
          </div>
        )}

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
