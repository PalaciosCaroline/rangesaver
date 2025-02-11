// trainingSession.js
"use client";

import { useState, useEffect } from "react";
import "./../styles/training.css";
import { POSITIONS } from "@/data/positions";
import { RANGES } from "@/data/ranges";
import { VILLAIN_DECISIONS } from "@/data/villainDecisions";
import { COMBOS } from "@/data/combos";
import PokerTable from "./../components/pokerTable";
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
      setHeroPosition(getRandomElement(Object.keys(RANGES)));
      return;
    }
  
    console.log(`🎯 Héros sélectionné : ${heroPosition}`);
  
    // Sélectionne un adversaire (RFI inclus)
    const possibleVillains = Object.keys(VILLAIN_DECISIONS[heroPosition] || []);
  
    if (!possibleVillains.length) {
      console.warn(`⚠️ Aucune situation trouvée pour ${heroPosition}. Relance...`);
      return startNewHand();
    }
  
    const selectedSpot = getRandomElement(possibleVillains);
    const villainRangeKey = VILLAIN_DECISIONS[heroPosition][selectedSpot];
  
    console.log(`👥 Spot sélectionné : ${selectedSpot} → Key: ${villainRangeKey}`);
  
    const newHeroHand = getRandomElement(COMBOS);
    if (!newHeroHand) {
      console.error("🚨 ERREUR : Le combo est vide ou incorrect !");
      return;
    }
  
    const cardFilenames = getCardFilenames(newHeroHand);
    const heroRanges = RANGES[heroPosition]?.[villainRangeKey];
  
    if (!heroRanges) {
      console.warn(`⚠️ Aucune range trouvée pour ${heroPosition} contre ${selectedSpot}`);
      return;
    }
  
    const possibleActions = Object.keys(heroRanges).filter(action => heroRanges[action]?.length > 0);
    if (!possibleActions.length) {
      console.warn(`⚠️ Aucune action trouvée pour ${heroPosition} vs ${selectedSpot}`);
      return;
    }
  
    console.log(`🎯 Actions disponibles : ${[...possibleActions, "Fold"].join(", ")}`);
  
    setVillainSpot(selectedSpot);
    setHeroHand(newHeroHand);
    setCardImages(cardFilenames);
    setAvailableActions([...possibleActions, "Fold"]);
    setFeedback("");
    setSessionStarted(true);
  };
  

  const getActionClass = (action) => {
    return `action-${action.replace(/\s+/g, "")}`; 
};

const TABLE_POSITIONS = ["top", "left-top", "left-bottom", "right-bottom", "right-top", "bottom"];

const heroIndex = heroPosition ? POSITIONS.indexOf(heroPosition) : -1;
const villainIndex = villainSpot && heroIndex !== -1 
  ? (POSITIONS.indexOf(villainSpot) - heroIndex + POSITIONS.length) % POSITIONS.length
  : -1;

const villainPosition = villainIndex !== -1 ? TABLE_POSITIONS[villainIndex] : "";

const heroImage = "/images/poisson_globe.png"; 
const villainImage = "/images/requin.png"; 

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
        
       
                <p>Position Héros : <strong>{heroPosition}</strong></p>
                <p>Spot Villain : <strong>{villainSpot}</strong></p>

                <div className="training-container">
            
                <PokerTable 
  heroCards={Array.isArray(cardImages) ? cardImages.filter(Boolean) : []} // ✅ Vérifie que les cartes sont valides
  heroImage={heroImage || "/images/default_hero.png"}  
  villainImage={villainImage || "/images/default_villain.png"}
  villainPosition={villainPosition}  
/>

      
    
    </div>

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
