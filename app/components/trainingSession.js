"use client";

import { useState } from "react";
import { POSITIONS } from "@/data/positions";
import { RANGES } from "@/data/ranges";
import { VILLAIN_DECISIONS } from "@/data/villainDecisions";
import { DECK } from "@/data/deck";

export default function TrainingSession() {
  const [heroPosition, setHeroPosition] = useState(null);
  const [villainSpot, setVillainSpot] = useState(null);
  const [heroHand, setHeroHand] = useState(null);
  const [availableActions, setAvailableActions] = useState([]);
  const [feedback, setFeedback] = useState("");

  // Fonction pour obtenir un élément aléatoire d'un tableau
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  // Fonction principale pour lancer une nouvelle situation d'entraînement
  const startNewHand = () => {
    // 1️⃣ Choix aléatoire d'une position pour le HÉROS
    const hero = getRandomElement(POSITIONS);
    
    // 2️⃣ Sélection aléatoire d'un spot en fonction du HÉROS
    const spots = Object.keys(VILLAIN_DECISIONS[hero] || {});
    if (spots.length === 0) {
      startNewHand(); // Relancer si aucune situation n'existe
      return;
    }
    const selectedVillainSpot = getRandomElement(spots);

    // 3️⃣ Générer une main aléatoire pour le HÉROS
    const heroHand = getRandomElement(DECK);

    // 4️⃣ Vérifier si des actions existent pour cette situation
    const heroRanges = RANGES[hero]?.[selectedVillainSpot];

    if (!heroRanges) {
      console.warn(`Aucune range trouvée pour ${hero} contre ${selectedVillainSpot}`);
      startNewHand();
      return;
    }

    // 5️⃣ Extraire toutes les actions possibles
    const possibleActions = Object.keys(heroRanges).filter(action => heroRanges[action].length > 0);
    
    // Ajouter systématiquement l'option "Fold"
    const allActions = [...possibleActions, "Fold"];

    // Mettre à jour l'état
    setHeroPosition(hero);
    setVillainSpot(selectedVillainSpot);
    setHeroHand(heroHand);
    setAvailableActions(allActions);
    setFeedback("");
  };

  // Fonction pour gérer le choix du joueur
  const handleAction = (action) => {
    if (action === "Fold") {
      setFeedback("✅ Fold est toujours une option !");
      return;
    }

    // Vérifier si la main est bien dans la range pour cette action
    const validHands = RANGES[heroPosition]?.[villainSpot]?.[action] || "";
    if (validHands.includes(heroHand)) {
      setFeedback("✅ Bonne décision !");
    } else {
      setFeedback("❌ Mauvaise décision, cette main ne correspond pas.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Entraînement Poker</h1>
      {heroPosition && (
        <>
          <p>🃏 Main : <strong>{heroHand}</strong></p>
          <p>📍 Héros : <strong>{heroPosition}</strong></p>
          <p>🎭 Spot Villain : <strong>{villainSpot}</strong></p>
          <h2 className="font-semibold mt-4">Quelle action prends-tu ?</h2>

          <div className="mt-2">
            {availableActions.map((action) => (
              <button
                key={action}
                className="m-2 p-2 bg-blue-500 text-white rounded"
                onClick={() => handleAction(action)}
              >
                {action}
              </button>
            ))}
          </div>

          <p className="mt-4">{feedback}</p>
        </>
      )}
      <button className="mt-4 p-2 bg-green-500 text-white rounded" onClick={startNewHand}>
        🔄 Nouvelle main
      </button>
    </div>
  );
}
