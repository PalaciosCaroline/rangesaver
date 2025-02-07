"use client";

import { useState } from "react";
import "./../styles/training.css";
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
  const [cardImages, setCardImages] = useState([]);

  // Fonction pour obtenir un élément aléatoire d'un tableau
  const getRandomElement = (array) => {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  };

  // Conversion des noms des cartes pour correspondre à ton format `A_of_spades.svg`
  const SUITS = ["spades", "hearts", "diamonds", "clubs"];
  const RANKS = {
    "A": "A",
    "K": "K",
    "Q": "Q",
    "J": "J",
    "T": "T",
    "9": "9",
    "8": "8",
    "7": "7",
    "6": "6",
    "5": "5",
    "4": "4",
    "3": "3",
    "2": "2"
  };

  // Fonction pour récupérer les fichiers SVG des cartes en fonction de la main
  const getCardFilenames = (hand) => {
    if (!hand || hand.length < 3) {
      console.error("🚨 Format de main invalide !");
      return [];
    }

    const rank1 = RANKS[hand[0]];
    const rank2 = RANKS[hand[1]];
    const suited = hand[2] === "s";
    const offsuit = hand[2] === "o";

    if (!rank1 || !rank2) {
      console.error("🚨 Rang inconnu :", hand);
      return [];
    }

    if (suited) {
      const suit = getRandomElement(SUITS);
      return [`${rank1}_of_${suit}.svg`, `${rank2}_of_${suit}.svg`];
    }

    if (offsuit) {
      let suit1 = getRandomElement(SUITS);
      let suit2;
      do {
        suit2 = getRandomElement(SUITS);
      } while (suit1 === suit2);
      return [`${rank1}_of_${suit1}.svg`, `${rank2}_of_${suit2}.svg`];
    }

    return [];
  };

  // Fonction principale pour lancer une nouvelle situation d'entraînement
  const startNewHand = () => {
    console.clear();
    console.log("🔄 Début d'une nouvelle main...");

    // 1️⃣ Choix aléatoire d'une position pour le HÉROS
    const hero = getRandomElement(POSITIONS);
    if (!hero) {
      console.error("🚨 ERREUR : Impossible de choisir une position pour le héros !");
      return;
    }
    console.log(`📍 Héros sélectionné : ${hero}`);

    // 2️⃣ Vérification et sélection d'un villainSpot valide
    const villainSpots = Object.keys(VILLAIN_DECISIONS[hero] || {});
    if (!villainSpots.length) {
      console.warn(`⚠️ Aucune situation trouvée pour ${hero}. Relance...`);
      return startNewHand();
    }
    const selectedVillainSpot = getRandomElement(villainSpots);
    console.log(`🎭 Spot du Villain : ${selectedVillainSpot}`);

    // 3️⃣ Génération d'une main aléatoire pour le héros
    const newHeroHand = getRandomElement(DECK);
    if (!newHeroHand) {
      console.error("🚨 ERREUR : Le deck est vide ou incorrect !");
      return;
    }
    console.log(`🃏 Main du héros : ${newHeroHand}`);

    // 4️⃣ Conversion de la main en fichiers SVG
    const cardFilenames = getCardFilenames(newHeroHand);
    if (!cardFilenames.length) {
      console.error("🚨 ERREUR : Impossible de récupérer les fichiers des cartes !");
      return;
    }
    console.log(`📸 Cartes générées : ${cardFilenames}`);

    // 🔄 Mise à jour de l'état
    setHeroPosition(hero);
    setVillainSpot(selectedVillainSpot);
    setHeroHand(newHeroHand);
    setCardImages(cardFilenames);
    setFeedback("");
  };

  // Fonction pour attribuer une classe CSS selon l'action
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
          <p>Main du Héros :</p>
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
                className={`btn ${getActionClass(action)}`}
                onClick={() => handleAction(action)}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Message de feedback */}
          <p className={`feedback ${feedback.includes("✅") ? "success" : "error"}`}>
            {feedback}
          </p>

          <button className="buttonTraining" onClick={startNewHand}>
            🔄 Nouvelle main
          </button>
        </>
      )}
    </div>
  );
}
