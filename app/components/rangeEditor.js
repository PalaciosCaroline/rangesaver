//components/rangeEditor;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRangeToFirebase, getRangeData } from "@/lib/firebase";
import { getAuth } from "firebase/auth"; // ✅ Ajout de l'authentification
import { CONTEXT_OPTIONS } from "@/data/positions";
import HandMatrix from "@/app/components/handMatrix";
import RangeSettings from "@/app/components/rangeSettings";
import ActionsSelector from "@/app/components/actionsSelector";
import { v4 as uuidv4 } from "uuid"; // Pour générer un ID si nécessaire
import "./../styles/rangeEditor.css";


function RangeEditor({ rangeId }) {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  const isNewRange = !rangeId;


   // ✅ Récupérer l'utilisateur connecté
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    router.push("/auth/login"); // 🔥 Redirige si non connecté
    return null;
  }

  const [rangeData, setRangeData] = useState({
    context: CONTEXT_OPTIONS[0],
    blinds: "",
    numSeats: 6,
    heroPosition: "",
    spot: "Open",
    villainPosition: "Aucun",
    handColors: {},
    rangeDescription: "",
    userId: user.uid, // ✅ Associe la range à l'utilisateur connecté
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
          if (data.userId !== user.uid) {
            alert("⛔ Accès refusé : cette range ne vous appartient pas !");
            router.push("/ranges"); // 🔥 Redirige vers la liste des ranges
            return;
          }
          setRangeData(data);
        } else {
          console.error("🚨 Aucune range trouvée pour cet ID :", rangeId);
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      }
    };

    fetchRange();
  }, [rangeId, user.uid]);

  useEffect(() => {
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
      if (rangeData.blinds) delete newErrors.blinds; // Supprime l'erreur si l'utilisateur corrige
      return newErrors;
    });
  }, [rangeData.blinds]); // Se déclenche uniquement quand `blinds` change
  

  // ✅ Validation des blinds
  const validateBlinds = (value) => {
    const num = Number(value); // ✅ Convertit directement en nombre
  
    if (isNaN(num) || num < 1 || num > 100) {
      return "1<=BB<=100"; // ❌ Erreur si hors limite ou invalide
    }
  
    return ""; // ✅ Aucune erreur
  };

  // ✅ Vérification globale
  const validateFields = () => {
    let newErrors = {};

    const blindsError = validateBlinds(rangeData.blinds);
    if (blindsError) newErrors.blinds = blindsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  //  Enregistrement de la range (nouvelle ou existante)
  const handleSave = async () => {
    setIsSubmitted(true);
    if (!validateFields()) return;

    const id = rangeId || uuidv4();

    console.log("Données envoyées à Firebase :", {
      ...rangeData,
      userId: user.uid, // ✅ Ajoute l'ID utilisateur
    });

    try {
      await saveRangeToFirebase(
        id,
        rangeData.context,
        rangeData.rangeDescription,
        rangeData.blinds,
        rangeData.numSeats,
        rangeData.heroPosition,
        rangeData.spot,
        rangeData.villainPosition,
        rangeData.handColors,
        user.uid // Passe l'ID utilisateur à Firebase
      );

      alert("Modifications enregistrées !");
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
  {isNewRange ? "Créer une nouvelle range" : isEditing ? "Modifier la Range" : "Range"}
</h1>


      {!isEditing ? (
        <>
        {!isEditing && (
  <div className="range-info">
    <p><strong> {rangeData.context}  {rangeData.blinds} BB {rangeData.numSeats} joueurs Héros en {rangeData.heroPosition}  spot {rangeData.spot || "Non défini"}</strong></p>{rangeData.spot !== "Open" && (
              <p><strong>Villain :</strong> {rangeData.villainPosition || "Non défini"}</p>
            )}      <p><strong>{rangeData.rangeDescription}</strong></p>
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
            setErrors={setErrors}
            validateBlinds={validateBlinds}
            isSubmitted={isSubmitted}
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
