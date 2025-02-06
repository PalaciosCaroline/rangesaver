"use client";
import React from "react";
import { useAuth } from "./components/authContext";
import HandMatrix from "./components/handMatrix";
import Logout from "./auth/logout";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Enregistreur de ranges</h1>
      {user ? (
        <>
          <Logout />
          <HandMatrix rangeId="default-range" />
        </>
      ) : (
        <>
          <p>Vous devez être connecté pour voir la matrice.</p>
          <Link href="/auth/login">Se connecter</Link>
          <Link href="/auth/signup">Créer un compte</Link>
        </>
      )}
    </div>
  );
}



