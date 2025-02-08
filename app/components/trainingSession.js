"use client";

import { useState } from "react";
import "./../styles/training.css";
import { POSITIONS } from "@/data/positions";
import { RANGES } from "@/data/ranges";
import { VILLAIN_DECISIONS } from "@/data/villainDecisions";
import { DECK } from "@/data/deck";
import getCardFilenames from "./../utils/getCardFileName";
import getRandomElement from "./../utils/getRandomElement";
import handleAction from "../utils/handleAction";
import Image from "next/image";

export default function TrainingSession() {
  const [heroPosition, setHeroPosition] = useState(null);
  const [villainSpot, setVillainSpot] = useState(null);
  const [heroHand, setHeroHand] = useState(null);
  const [availableActions, setAvailableActions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [cardImages, setCardImages] = useState([]);
  const [correctAction, setCorrectAction] = useState(null);

  const getColorFromAction = (action) => {
    switch (action) {
      case "Fold":
        return "red";
      case "Raise":
        return "blue";
      case "Call":
        return "yellow";
      default:
        return "black";
    }
  };

  const color = getColorFromAction(correctAction);


  // Fonction principale pour lancer une nouvelle situation d'entraînement
  const startNewHand = () => {
    console.clear();
   
    // 1️⃣ Choix aléatoire d'une position pour le HÉROS
    const hero = getRandomElement(POSITIONS);
    if (!hero) {
      console.error("🚨 ERREUR : Impossible de choisir une position pour le héros !");
      return;
    }

    // 2️⃣ Vérification et sélection d'un villainSpot valide
    const villainSpots = Object.keys(VILLAIN_DECISIONS[hero] || {});
    if (!villainSpots.length) {
      console.warn(`⚠️ Aucune situation trouvée pour ${hero}. Relance...`);
      return startNewHand();
    }
    const selectedVillainSpot = getRandomElement(villainSpots);

    // 3️⃣ Génération d'une main aléatoire pour le héros
    const newHeroHand = getRandomElement(DECK);
    if (!newHeroHand) {
      console.error("🚨 ERREUR : Le deck est vide ou incorrect !");
      return;
    }
   
    const cardFilenames = getCardFilenames(newHeroHand);

    // 4️⃣ Récupération de la clé de range associée
    const villainRangeKey = VILLAIN_DECISIONS[hero][selectedVillainSpot];
    if (!villainRangeKey) {
      console.warn(`⚠️ Clé du Villain non trouvée pour ${hero} contre ${selectedVillainSpot}`);
      return startNewHand();
    }

    // 5️⃣ Vérification des ranges disponibles pour le héros
    const heroRanges = RANGES[hero]?.[villainRangeKey];
    if (!heroRanges) {
      console.warn(`⚠️ Aucune range trouvée pour ${hero} contre ${selectedVillainSpot}`);
      return startNewHand();
    }

    // 6️⃣ Extraction des actions possibles
    const possibleActions = Object.keys(heroRanges).filter(action => {
      return heroRanges[action] && heroRanges[action].length > 0;
    });

    if (!possibleActions.length) {
      console.warn(`⚠️ Aucune action trouvée pour ${hero} vs ${selectedVillainSpot}`);
      return startNewHand();
    }

    // 7️⃣ Ajout systématique de "Fold"
    const allActions = [...possibleActions, "Fold"];
    console.log(`Actions disponibles : ${allActions.join(", ")}`);

    // Mettre à jour l'état
    setHeroPosition(hero);
    setVillainSpot(selectedVillainSpot);
    setHeroHand(newHeroHand);
    setCardImages(cardFilenames);
    setAvailableActions(allActions);
    setFeedback("");
  };

  const getActionClass = (action) => {
    return `action-${action.replace(/\s+/g, "")}`; 
};
  

  return (
    <div className="poker-containerTraining">
     
      {!heroPosition ? (
        <button className="btn buttonTraining" onClick={startNewHand}>
          Lancer une nouvelle main
        </button>
      ) : (
        <>
         
           <div className="card-container">
         {cardImages.map((filename, index) => (
              <img key={index} src={`/cards/${filename}`} alt={filename} className="card-img" />
            ))}
          </div>
                <p>Position Héros : <strong>{heroPosition}</strong></p>
                <p>Spot Villain : <strong>{villainSpot}</strong></p>

          <div className="mt-2">
            {availableActions.map((action) => (
              <button
              key={action}
              className={`btn ${getActionClass(action)} ${correctAction === action ? "correct-action" : ""}`}
              onClick={() => {
                const isCorrect = handleAction(
                  action,
                  heroPosition,
                  villainSpot,
                  heroHand,
                  setFeedback,
                  VILLAIN_DECISIONS,
                  RANGES
                );
        
                if (isCorrect) {
                  setCorrectAction(action); // Stocke l’action correcte
                } else {
                  setCorrectAction(null); // Réinitialise si incorrect
                }
              }}
            >
                {action}
              </button>
            ))}
          </div>

            {/* Message de feedback */}
            <p className={`feedback ${feedback.includes("✅") ? "success" : "error"}`}>
                    {feedback}
                </p>

          <button className="btn buttonTraining" onClick={startNewHand}>
            Nouvelle main
          </button>
        </>
      )}
    </div>
  );
}
