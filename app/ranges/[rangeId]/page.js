"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { COMBOS } from "../../../data/combos"; // Vérifie le chemin correct de `combos`
import "./../../styles/handMatrix.css"; // Assure-toi d'inclure les styles
import { chunk } from "@/app/utils/chunk";
import {actions} from "@/data/actions"


export default function RangeDetail() {
  const params = useParams();
  const rangeId = params?.rangeId; // ✅ Utilisation du bon paramètre
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
  console.log("📌 Paramètres récupérés dans l'URL :", params);
  console.log("🔍 ID de la range extrait :", rangeId);



  useEffect(() => {
    if (!rangeId) {
      console.error("🚨 Aucun rangeId trouvé !");
      setLoading(false);
      return;
    }
  
    const fetchRange = async () => {
      try {
        console.log("📡 Récupération de la range avec ID :", rangeId);
  
        const docRef = doc(db, "ranges", rangeId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          console.log("✅ Range trouvée :", docSnap.data());
          setRange({ id: rangeId, ...docSnap.data() });
        } else {
          console.error("🚨 Aucun document trouvé pour l'ID :", rangeId);
          setRange(null);
        }
      } catch (error) {
        console.error("🚨 Erreur Firestore :", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRange(); // ✅ Correction : Appel de la fonction
  }, [rangeId]);
  
  if (loading) return <p>Chargement...</p>;
  if (!range) return <p>Aucune range trouvée.</p>;


return (
  <div>
    <h1 className="h1Ranges">Détails de la Range : {range.rangeName}</h1>
    <p>Blinds : {range.blinds}BB</p>
    <p>Héros : {range.heroPosition}</p>
    <p>Spot : {range.spot}</p>
    <p>Villain : {range.villainPosition || "Aucun"}</p>

    {/* 📌 Matrice des mains */}
    <div className="hand-matrix">
      {chunk(COMBOS, 13).map((row, rowIndex) => (
        <div key={rowIndex} className="hand-matrix-row">
          {row.map((combo) => (
            <div
              key={combo}
              className="hand-matrix-cell"
              style={{ background: actions[range.handColors?.[combo]] || "#F5F5F5" }}
            >
              {combo}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
}
