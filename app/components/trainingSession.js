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

// Ordre fixe des sièges autour de la table
const TABLE_POSITIONS = ["bottom", "left-bottom", "left-top", "top", "right-top", "right-bottom"];

// Ordre des positions de poker dans le sens horaire
const POSITIONS = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];

// Mapping pour convertir les abréviations en noms de positions complètes
const POSITION_ABBREVIATIONS = {
    "LJ": "LJ",
    "HJ": "HJ",
    "CO": "CO",
    "BT": "BTN",  // Correction ici : BT → BTN
    "SB": "SB",
    "BB": "BB"
};

// Trouver l'index du héros dans la liste des positions
const heroIndex = heroPosition ? POSITIONS.indexOf(heroPosition) : -1;

// Mapping pour assigner les positions aux sièges
const seatMapping = {};

// Si le héros a une position
if (heroIndex !== -1) {
    let seatIndex = 0; // Indice dans TABLE_POSITIONS

    for (let i = 0; i < POSITIONS.length; i++) {
        const currentPosition = POSITIONS[(heroIndex + i) % POSITIONS.length];

        // Le héros est toujours en bottom
        if (i === 0) {
            seatMapping[currentPosition] = "bottom";
        } else {
            seatMapping[currentPosition] = TABLE_POSITIONS[++seatIndex];
        }
    }
}

// Extraction du villain depuis villainSpot
let villain = "";
if (villainSpot && villainSpot !== "RFI") {
    const villainAbbr = villainSpot.slice(0, 2); // Prend les deux premières lettres
    villain = POSITION_ABBREVIATIONS[villainAbbr] || ""; // Convertit l'abréviation en nom de position
}

// Déterminer la position du villain à la table
const villainPosition = villain && seatMapping[villain] ? seatMapping[villain] : "";




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
  heroPosition={heroPosition}
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
