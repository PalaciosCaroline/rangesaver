//components/rangeEditor;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRangeToFirebase, getRangeData } from "@/lib/firebase";
import HandMatrix from "@/app/components/handMatrix";
import RangeSettings from "@/app/components/rangeSettings";
import ActionsSelector from "@/app/components/actionsSelector";
import { v4 as uuidv4 } from "uuid"; // Pour générer un ID si nécessaire
import "./../styles/rangeEditor.css";


function RangeEditor({ rangeId }) {
  const router = useRouter();
  const isNewRange = !rangeId;

  // ✅ État de la range
  const [rangeData, setRangeData] = useState({
    rangeName: "",
    blinds: "",
    heroPosition: "",
    spot: "",
    villainPosition: "",
    handColors: {},
  });

  const [selectedAction, setSelectedAction] = useState("fold");
  const [isEditing, setIsEditing] = useState(isNewRange); // En mode édition si nouvelle range

  // Chargement des données si `rangeId` est défini
  useEffect(() => {
    if (!rangeId) return;

    const fetchRange = async () => {
      try {
        const data = await getRangeData(rangeId);
        if (data) {
          setRangeData(data);
        } else {
          console.error("🚨 Aucune range trouvée pour cet ID :", rangeId);
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      }
    };

    fetchRange();
  }, [rangeId]);

  // ✅ Enregistrement de la range (nouvelle ou existante)
  const handleSave = async () => {
    const id = rangeId || uuidv4(); // Génère un ID pour une nouvelle range

    try {
      await saveRangeToFirebase(
        id,
        rangeData.rangeName,
        rangeData.blinds,
        rangeData.heroPosition,
        rangeData.spot,
        rangeData.villainPosition,
        rangeData.handColors
      );

      alert("✅ Modifications enregistrées !");
      setIsEditing(false);
      if (isNewRange) router.push(`/ranges/${id}`);
    } catch (error) {
      console.error("🚨 Erreur lors de l'enregistrement :", error);
      alert("❌ Erreur lors de l'enregistrement !");
    }
  };

  return (
    <div className="range-editor-container">
      <button className="back-button" onClick={() => router.push("/ranges")}>
        ⬅ Retour aux Ranges
      </button>
      <h1>
  {isNewRange ? "Créer une nouvelle range" : isEditing ? "Modifier la Range" : `Range : ${rangeData.rangeName}`}
</h1>


      {!isEditing ? (
        <>
        {!isEditing && (
  <div className="range-info">
    <p><strong>BB :</strong> {rangeData.blinds} BB</p>
    <p><strong>Héros :</strong> {rangeData.heroPosition || "Non défini"}</p>
    <p><strong>Spot :</strong> {rangeData.spot || "Non défini"}</p>
    <p><strong>Villain :</strong> {rangeData.villainPosition || "Non défini"}</p>
  </div>
)}

          <HandMatrix rangeData={rangeData} readOnly={true} />
          <button className="edit-button" onClick={() => setIsEditing(true)}>Modifier cette range</button>
        </>
      ) : (
        <>
          <RangeSettings 
            rangeData={rangeData} 
            setRangeData={setRangeData} 
          />

          {/* ✅ Ajout d'un sélecteur unique pour éviter le doublon */}
          <div className="actions-container">
            <ActionsSelector 
              selectedAction={selectedAction} 
              setSelectedAction={setSelectedAction} 
            />
          </div>

          <HandMatrix 
            rangeData={rangeData} 
            setRangeData={setRangeData} 
            selectedAction={selectedAction} 
            readOnly={false} 
          />

          <button className="save-button" onClick={handleSave}>Enregistrer</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>❌ Annuler</button>
        </>
      )}
    </div>
  );
}

export default RangeEditor;
