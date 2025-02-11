import React from "react";
import Image from "next/image"; 
import "./../styles/pokerTable.css"; 

export default function PokerTable({ heroCards, heroImage, villainImage, villainPosition }) {
  const players = [
    { id: 1, name: "Joueur 1", position: "top" },
    { id: 2, name: "Joueur 2", position: "left-top" },
    { id: 3, name: "Joueur 3", position: "left-bottom" },
    { id: 4, name: "Joueur 4", position: "right-top" },
    { id: 5, name: "Joueur 5", position: "right-bottom" },
    { id: 6, name: "HÉROS", position: "bottom", hero: true },
  ];

  return (
    <div className="poker-container">
      <div className="poker-table">
        {players.map((player) => {
          const isHero = player.hero;
          const isVillain = player.position === villainPosition;
          const hasImage = isHero ? heroImage : isVillain ? villainImage : null;

          return (
            <div key={player.id} className={`player ${player.position}`}>
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
                  <span>{player.name}</span>  
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
