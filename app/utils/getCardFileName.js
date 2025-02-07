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

import getRandomElement from "./getRandomElement";

export default function getCardFilenames(hand) {
    if (!hand || hand.length < 2) {
        console.error("🚨 Format de main invalide !", hand);
        return [];
    }

    const SUITS = ["spades", "hearts", "diamonds", "clubs"];
    const RANKS = { "A": "A", "K": "K", "Q": "Q", "J": "J", "T": "10", "9": "9", "8": "8", "7": "7", "6": "6", "5": "5", "4": "4", "3": "3", "2": "2" };

    const rank1 = RANKS[hand[0]];
    const rank2 = RANKS[hand[1]];
    
    if (!rank1 || !rank2) {
        console.error("🚨 Rang inconnu :", hand);
        return [];
    }

    if (hand.length === 2) {
        // 🔹 CAS DES PAIRES (ex: "AA", "KK", "22")
        let suit1 = getRandomElement(SUITS);
        let suit2;
        do {
            suit2 = getRandomElement(SUITS);
        } while (suit1 === suit2); // Assurer que les couleurs sont différentes

        return [`${rank1}_of_${suit1}.svg`, `${rank2}_of_${suit2}.svg`];
    } 

    const suited = hand[2] === "s"; // Suited
    const offsuit = hand[2] === "o"; // Offsuit

    if (suited) {
        // 🔹 Mains Suited : les deux cartes ont la même couleur
        const suit = getRandomElement(SUITS);
        return [`${rank1}_of_${suit}.svg`, `${rank2}_of_${suit}.svg`];
    } else if (offsuit) {
        // 🔹 Mains Offsuit : les cartes ont des couleurs différentes
        let suit1 = getRandomElement(SUITS);
        let suit2;
        do {
            suit2 = getRandomElement(SUITS);
        } while (suit1 === suit2);

        return [`${rank1}_of_${suit1}.svg`, `${rank2}_of_${suit2}.svg`];
    }

    // 🔹 Cas improbable : erreur de format
    console.error("🚨 Erreur : Format de main inconnu :", hand);
    return [];
};
