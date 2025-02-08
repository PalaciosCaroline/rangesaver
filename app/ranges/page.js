"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // ✅ db est importé depuis firebase.js
import { collection, getDocs } from "firebase/firestore"; // ✅ Importé directement depuis Firestore
import { useRouter } from "next/navigation";

export default function RangesList() {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ranges")); // ✅ Correction ici
        const rangesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRanges(rangesData);
      } catch (error) {
        console.error("🚨 Erreur lors de la récupération des ranges :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanges();
  }, []);

  if (loading) return <p>Chargement des ranges...</p>;

  return (
    <div>
      <h1 className="h1Ranges">Ranges Enregistrées</h1>
      {ranges.length === 0 ? (
        <p>Aucune range trouvée.</p>
      ) : (
        <ul>
          {ranges.map(range => (
            <li key={range.id}>
              <button onClick={() => router.push(`/ranges/${range.id}`)}>
                {range.rangeName} - {range.blinds}BB ({range.heroPosition})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
