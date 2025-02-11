import React from "react";
import Image from "next/image";
import { POSITIONS } from "@/data/positions";
import { TABLE_POSITIONS } from "@/data/positions";
import "./../styles/pokerTable.css"; 

export default function PokerTable({ heroCards, heroImage, villainImage, villainPosition,heroPosition }) {

 // Mapping des positions spéciales (Dealer, Blinds)
 const POSITION_MARKERS = {
  "BTN": "D",
  "SB": "0.5BB",
  "BB": "1BB",
};

  // Trouver l'index du héros pour assigner les autres positions dynamiquement
  const heroIndex = POSITIONS.indexOf(heroPosition);

  // Générer les noms des positions dynamiquement en fonction du héros
  const seatMapping = {};
  if (heroIndex !== -1) {
    let seatIndex = 0;
    for (let i = 0; i < POSITIONS.length; i++) {
      const currentPosition = POSITIONS[(heroIndex + i) % POSITIONS.length];
      seatMapping[TABLE_POSITIONS[seatIndex++]] = currentPosition;
    }
  }

  const players = TABLE_POSITIONS.map((tablePos, index) => {
    const positionName = seatMapping[tablePos] || ""; // Récupère la vraie position LJ, HJ, CO, etc.
    return {
      id: index + 1,
      name: positionName,
      position: tablePos,
      hero: tablePos === "bottom",
      marker: POSITION_MARKERS[positionName] || "", // Utilise `positionName` au lieu de `playerPosition`
    };
});

  return (
    <div className="poker-container">
      <div className="poker-table">
        {players.map((player) => {
          const isHero = player.hero;
          const isVillain = player.position === villainPosition;
          const hasImage = isHero ? heroImage : isVillain ? villainImage : null;

          return (
            <div key={player.id} className={`player ${player.position}`}>
                <div className="avatar-container">
              <div className={`avatar ${hasImage ? "has-image" : "no-image"}`}>
                {hasImage && typeof hasImage === "string" && hasImage.trim() !== "" ? (
                  <Image 
                    src={hasImage}
                    alt={isHero ? "Héros" : "Villain"}
                    className="player-img"
                    width={80}
                    height={80}
                    unoptimized 
                  />
                ) : (
                  <span className="player-name">{player.name}</span>  
                )}
              </div>
              <div className="player-name-box">
                  {player.name}
                </div>

                {player.marker && (
  <div className={`player-marker ${player.name === "BTN" ? "dealer" : player.name === "SB" ? "sb" : player.name === "BB" ? "bb" : ""}`}>
    {player.marker}
  </div>
)}
              </div>

              {/* ✅ Vérification stricte avant d'afficher les cartes */}
              {isHero && Array.isArray(heroCards) && heroCards.length > 0 && (
                <div className="hero-cards">
                  {heroCards.map((filename, index) =>
                    filename ? (
                      <Image
                        key={index}
                        src={`/cards/${filename}`}
                        alt={filename}
                        width={50}
                        height={70}
                        className="card-img"
                        unoptimized
                      />
                    ) : null
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
