"use client";

import { useState, useEffect } from "react";
import "./../styles/training.css";
import { POSITIONS } from "@/data/positions";
import { RANGES } from "@/data/ranges";
import { VILLAIN_DECISIONS } from "@/data/villainDecisions";
import { COMBOS } from "@/data/combos";
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
  const [sessionStarted, setSessionStarted] = useState(false);


  const getColorFromAction = (action) => {
    switch (action) {
      case "Fold":
        return "red";
      case "Raise":
        return "blue";
      case "Call":
        return "green";
      default:
        return "black";
    }
  };

  const color = getColorFromAction(correctAction);

  // Démarre la première main dès que la position du héros est définie
  useEffect(() => {
    if (heroPosition) {
      startNewHand();
    }
  }, [heroPosition]);

  const startNewHand = () => {
    console.clear();
  
    if (!heroPosition) {
      const randomHero = getRandomElement(Object.keys(RANGES));
      setHeroPosition(randomHero);
      console.log(`🎲 Position aléatoire du héros : ${randomHero}`);
      return;
    }
  
    console.log(`🎯 Héros sélectionné : ${heroPosition}`);
  
    let selectedVillainSpot = null;
    let villainRangeKey = null;
  
    // Cas RFI : Pas d'adversaire encore connu
    if (RANGES[heroPosition]?.["RFI"]) {
      selectedVillainSpot = null;  // Aucun adversaire encore défini
      villainRangeKey = "RFI"; 
      console.log(`💡 Héros en Open-Raise (RFI) → Pas encore d’adversaire`);
    } else {
      // Cas où un adversaire est déjà présent (3-bet, limp, etc.)
      const villainSpots = Object.keys(VILLAIN_DECISIONS[heroPosition] || {});
  
      if (!villainSpots.length) {
        console.warn(`⚠️ Aucune situation trouvée pour ${heroPosition}. Relance...`);
        return startNewHand();
      }
  
      selectedVillainSpot = getRandomElement(villainSpots);
      villainRangeKey = VILLAIN_DECISIONS[heroPosition][selectedVillainSpot];
    }
  
    console.log(`🧐 Spot Villain sélectionné : ${selectedVillainSpot ?? "Aucun (RFI en attente)"}`);
    console.log(`📌 Clé de range associée : ${villainRangeKey}`);
  
    const newHeroHand = getRandomElement(COMBOS);
    if (!newHeroHand) {
      console.error("🚨 ERREUR : Le combo est vide ou incorrect !");
      return;
    }
  
    const cardFilenames = getCardFilenames(newHeroHand);
    const heroRanges = RANGES[heroPosition]?.[villainRangeKey];
  
    if (!heroRanges) {
      console.warn(`⚠️ Aucune range trouvée pour ${heroPosition} contre ${selectedVillainSpot ?? "RFI"}`);
      return;
    }
  
    const possibleActions = Object.keys(heroRanges).filter(action => heroRanges[action] && heroRanges[action].length > 0);
    if (!possibleActions.length) {
      console.warn(`⚠️ Aucune action trouvée pour ${heroPosition} vs ${selectedVillainSpot ?? "RFI"}`);
      return;
    }
  
    const allActions = [...possibleActions, "Fold"];
    console.log(`🎯 Actions disponibles : ${allActions.join(", ")}`);
  
    // ✅ Mettre à jour l'état
    setVillainSpot(selectedVillainSpot); // Peut être null si en RFI
    setHeroHand(newHeroHand);
    setCardImages(cardFilenames);
    setAvailableActions(allActions);
    setFeedback("");
    setSessionStarted(true);
  };
  

  const getActionClass = (action) => {
    return `action-${action.replace(/\s+/g, "")}`; 
};
  

  return (
    <div className="poker-containerTraining">
     
      
     {!sessionStarted ? (
        <div>
          <p>Choisissez la position du héros ou laissez le hasard décider :</p>
          <div className="position-buttons">
            {POSITIONS.map((position) => (
              <button key={position} className="btn btn-position" onClick={() => setHeroPosition(position)}>
                {position}
              </button>
            ))}
          </div>
          <button className="btn btn-random" onClick={() => setHeroPosition(getRandomElement(Object.keys(RANGES)))}>
  Choix aléatoire
</button>

        </div>
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
          <button className="btn buttonReset" onClick={() => { setHeroPosition(null); setSessionStarted(false); }}>
            Changer de position
          </button>
        </>
      )}
    </div>
  );
}
