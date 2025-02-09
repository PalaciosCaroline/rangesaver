"use client";
import { useEffect } from "react";
import { useAuth } from "./components/authContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login"); // ✅ Utilisation de `replace` pour éviter de revenir en arrière
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // ✅ Empêche d'afficher quoi que ce soit avant la redirection
  }


  return (
    <div>
      <h1 className="h1home">Bienvenue sur l&apos;application</h1>
      <p className="pHome">Vous êtes connecté !</p>
    </div>
  );
}
