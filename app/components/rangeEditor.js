//components/rangeEditor;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRangeToFirebase, getRangeData } from "@/lib/firebase";
import { CONTEXT_OPTIONS } from "@/data/positions";
import HandMatrix from "@/app/components/handMatrix";
import RangeSettings from "@/app/components/rangeSettings";
import ActionsSelector from "@/app/components/actionsSelector";
import { v4 as uuidv4 } from "uuid"; // Pour générer un ID si nécessaire
import "./../styles/rangeEditor.css";


function RangeEditor({ rangeId }) {
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const isNewRange = !rangeId;


   // ✅ État initial de la range
   const [rangeData, setRangeData] = useState({
    context: CONTEXT_OPTIONS[0],  //  Met une valeur par défaut
    rangeName: "",
    blinds: "",
    numSeats: 6, //  Par défaut, 6 joueurs
    heroPosition: "",
    spot: "Open",
    villainPosition: "Aucun",
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

  useEffect(() => {
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      if (rangeData.blinds) delete newErrors.blinds; // Supprime l'erreur si l'utilisateur corrige
      return newErrors;
    });
  }, [rangeData.blinds]); // Se déclenche uniquement quand `blinds` change
  

  const validateFields = () => {
    let newErrors = {}; // ✅ Initialise un objet vide pour stocker les erreurs
  
    if (!rangeData.blinds) {
      newErrors.blinds = "🚨 Veuillez indiquer une valeur pour les blinds !";
    }
  
    setErrors(newErrors); // Met à jour `errors` avec les erreurs trouvées
  
    console.log("DEBUG - newErrors après validation :", newErrors); // Vérifie si l'erreur est bien enregistrée
  
    return Object.keys(newErrors).length === 0; // Retourne `true` si aucune erreur
  };
  
  

  //  Enregistrement de la range (nouvelle ou existante)
  const handleSave = async () => {
    console.log("DEBUG - errors.blinds :", errors.blinds);
    if (!validateFields()) return; // Annule l’enregistrement si un champ obligatoire manque
    const id = rangeId || uuidv4(); // Génère un ID pour une nouvelle range

    try {
      await saveRangeToFirebase(
        id,
        rangeData.context,
        rangeData.rangeName,
        rangeData.blinds,
        rangeData.numSeats,
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
    <p><strong>Contexte :</strong> {rangeData.context || "Non défini"}</p>
            <p><strong>BB :</strong> {rangeData.blinds} BB</p>
            <p><strong>Table :</strong> {rangeData.numSeats} joueurs</p>
            <p><strong>Héros :</strong> {rangeData.heroPosition || "Non défini"}</p>
            <p><strong>Spot :</strong> {rangeData.spot || "Non défini"}</p>
            {rangeData.spot !== "Open" && (
              <p><strong>Villain :</strong> {rangeData.villainPosition || "Non défini"}</p>
            )}
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
            errors={errors}
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
