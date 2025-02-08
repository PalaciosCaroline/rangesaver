"use client";
import React, { useState, useEffect } from "react";
import { db, doc, getDoc } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

export default function RangeDetail() {
  const params = useParams();
  const rangeId = params?.rangeId; // ✅ Utilisation du bon paramètre
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("🧐 Vérification des params :", params);
  console.log("🔍 rangeId récupéré :", rangeId);

  useEffect(() => {
    if (!rangeId) {
      console.error("🚨 Aucun rangeId trouvé !");
      setLoading(false);
      return;
    }

    const fetchRange = async () => {
      try {
        const docRef = doc(db, "ranges", rangeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("✅ Range trouvée :", docSnap.data());
          setRange({ id: rangeId, ...docSnap.data() });
        } else {
          console.error("🚨 Aucun document trouvé pour l'ID :", rangeId);
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRange();
  }, [rangeId]);

  if (loading) return <p>Chargement...</p>;
  if (!range) return <p>Aucune range trouvée.</p>;

  return (
    <div>
      <h1>Détails de la Range : {range.rangeName}</h1>
      <p>Blinds : {range.blinds}BB</p>
      <p>Héros : {range.heroPosition}</p>
      <p>Spot : {range.spot}</p>
      <p>Villain : {range.villainPosition || "Aucun"}</p>

      <button onClick={() => router.push("/ranges")}>🔙 Retour</button>
    </div>
  );
}
