//ranges/page.js;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserRanges } from "@/lib/firebase"; // ✅ Nouvelle fonction à utiliser
import Link from "next/link";
import "./../styles/rangeList.css";

function RangesPage() {
  const [ranges, setRanges] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login"); // 🚨 Redirige si l'utilisateur n'est pas connecté
      } else {
        setUser(currentUser);
        try {
          const userRanges = await getUserRanges(currentUser.uid); // 🔥 Récupère les ranges de l'utilisateur
          setRanges(userRanges);
        } catch (error) {
          console.error("🚨 Erreur lors du chargement des ranges :", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur Firebase
  }, [router]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="range-list-container">
      <h1>Mes Ranges</h1>
      <button className="new-range-button" onClick={() => router.push("/ranges/new")}>+</button>

      {ranges.length === 0 ? (
        <p>Aucune range enregistrée.</p>
      ) : (
        <ul>
          {ranges.map(({ id, rangeDescription }) => (
            <li key={id}>
              <Link href={`/ranges/${id}`}>
                {rangeDescription || "Range sans nom"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RangesPage;
