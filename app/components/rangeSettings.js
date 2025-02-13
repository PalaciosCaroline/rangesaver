//components/rangeSettings;
import React, { useState, useEffect } from "react";
import { POSITIONS_BY_SEATS } from "@/data/positions";
import { CONTEXT_OPTIONS } from "@/data/positions";
import "./../styles/rangeSettings.css";

function RangeSettings({ rangeData, setRangeData }) {
  const [numSeats, setNumSeats] = useState(6); // ✅ Par défaut, 6 joueurs

  useEffect(() => {
    const availablePositions = POSITIONS_BY_SEATS[numSeats];

    // ✅ Réinitialisation si position invalide après changement du nombre de sièges
    if (!availablePositions.includes(rangeData.heroPosition)) {
      setRangeData((prev) => ({ ...prev, heroPosition: availablePositions[0] }));
    }
    if (!availablePositions.includes(rangeData.villainPosition)) {
      setRangeData((prev) => ({ ...prev, villainPosition: availablePositions[1] || "" }));
    }
  }, [numSeats]);
 
  /** ✅ Met à jour la valeur des blinds avec validation */
  const handleBlindsChange = (e) => {
    const value = e.target.value;

    // ✅ Permet de vider complètement le champ avant de taper un chiffre
    if (value === "") {
      setRangeData({ ...rangeData, blinds: "" });
      return;
    }

    // ✅ Vérifie si c'est un nombre seul ou une plage correcte
    if (/^\d+$/.test(value) || /^\d+\s*<\s*BB\s*<\s*\d+$/.test(value)) {
      setRangeData({ ...rangeData, blinds: value });
    } else {
      console.warn("🚨 Format invalide. Exemple attendu : '15 < BB < 19' ou '20'");
    }
  };

  

  return (
    <div className="selectors">
  <label>Contexte :</label>
      <select 
        value={rangeData.context || CONTEXT_OPTIONS[0]} 
        onChange={(e) => setRangeData({ ...rangeData, context: e.target.value })}
      >
        {CONTEXT_OPTIONS.map((ctx) => (
          <option key={ctx} value={ctx}>{ctx}</option>
        ))}
      </select>

      <label>Nom de la Range :</label>
      <input type="text" value={rangeData.rangeName} onChange={(e) => setRangeData({ ...rangeData, rangeName: e.target.value })} 
      placeholder="Nom de la Range"
      />

      <label>BB</label>
      <input 
        type="text"
        value={rangeData.blinds}
        onChange={handleBlindsChange}
        placeholder="Ex: 15 < BB < 19 ou 20"
      />

<label>Table :</label>
      <select 
        value={numSeats} 
        onChange={(e) => setNumSeats(Number(e.target.value))}
      >
        <option value="6">6 joueurs</option>
        <option value="8">8 joueurs</option>
        <option value="9">9 joueurs</option>
      </select>


      <label>Position du Héros :</label>
      <select 
        value={rangeData.heroPosition} 
        onChange={(e) => setRangeData({ ...rangeData, heroPosition: e.target.value })}
      >
        {POSITIONS_BY_SEATS[numSeats].map((pos) => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>


      <label>Spot :</label>
      <select value={rangeData.spot} onChange={(e) => setRangeData({ ...rangeData, spot: e.target.value })}>
        {["Open", "Single Action", "3bet", "Overcall & Squeeze"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {rangeData.spot !== "Open" && (
        <>
          <label>Position du Villain :</label>
          <select 
            value={rangeData.villainPosition} 
            onChange={(e) => setRangeData({ ...rangeData, villainPosition: e.target.value })}
          >
            {POSITIONS_BY_SEATS[numSeats]
              .filter(pos => pos !== rangeData.heroPosition) // ✅ Villain ≠ Héros
              .map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export default RangeSettings;
