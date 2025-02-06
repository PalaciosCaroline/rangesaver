"use client";
import { useEffect } from "react";
import { useAuth } from "./components/authContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login"); // ✅ Redirige si l'utilisateur n'est pas connecté
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Chargement...</p>; // ✅ Affiche un texte pendant le chargement de l'état utilisateur
  }

  return (
    <div>
      <h1>Bienvenue sur l&apos;application</h1>
      <p>Vous êtes connecté !</p>
    </div>
  );
}
