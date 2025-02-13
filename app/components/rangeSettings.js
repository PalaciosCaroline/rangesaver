//components/rangeSettings;
import React, { useState, useEffect } from "react";
import { POSITIONS_BY_SEATS } from "@/data/positions";
import { VILLAIN_POSITIONS_BY_SEATS } from "@/data/positions";
import { CONTEXT_OPTIONS } from "@/data/positions";
import "./../styles/rangeSettings.css";

function RangeSettings({ rangeData, setRangeData, errors, isSubmitted}) {
  const [numSeats, setNumSeats] = useState(6); // ✅ Par défaut, 6 joueurs

  useEffect(() => {
    if (rangeData.spot === "Open") {
      setRangeData((prev) => ({
        ...prev,
        villainPosition: "Aucun", // ✅ Forcé si `Open`
      }));
    }
  }, [rangeData.spot]);
  
  
  useEffect(() => {
    const availablePositions = POSITIONS_BY_SEATS[numSeats];
  
    // ✅ Réinitialisation si position invalide après changement du nombre de sièges
    if (!availablePositions.includes(rangeData.heroPosition)) {
      setRangeData((prev) => ({ ...prev, heroPosition: availablePositions[0] }));
    }
  
  }, [numSeats]); // ✅ Garde uniquement `numSeats`
  
 
/** ✅ Vérifie et met à jour la valeur des blinds */
const handleBlindsChange = (e) => {
  let value = e.target.value.trim();

  // ✅ Toujours mettre à jour l'affichage, même en cours de saisie
  setRangeData({ ...rangeData, blinds: value });

  // ✅ Permet de vider complètement le champ avant de taper une valeur
  if (value === "") return;

  // ✅ Vérification finale seulement quand l'utilisateur a fini d'écrire
  setTimeout(() => {
    let finalValue = value.trim();

    // ✅ Accepte un nombre simple entre 5 et 100
    if (/^\d+$/.test(finalValue)) {
      const num = parseInt(finalValue, 10);
      if (num >= 5 && num <= 100) {
        setRangeData({ ...rangeData, blinds: finalValue });
      } else {
        console.warn("🚨 Les blinds doivent être entre 5 et 100.");
      }
      return;
    }

    // ✅ Accepte une fourchette (ex: "20 < BB < 80")
    if (/^\d+\s*<\s*BB\s*<\s*\d+$/.test(finalValue)) {
      setRangeData({ ...rangeData, blinds: finalValue });
      return;
    }

    // ✅ Accepte un maximum (ex: "BB < 60")
    if (/^BB\s*<\s*\d+$/.test(finalValue)) {
      setRangeData({ ...rangeData, blinds: finalValue });
      return;
    }

    // ✅ Accepte un minimum (ex: "30 < BB")
    if (/^\d+\s*<\s*BB$/.test(finalValue)) {
      setRangeData({ ...rangeData, blinds: finalValue });
      return;
    }

    // ❌ Si aucun format valide n'est respecté, alors on affiche l'erreur
    console.warn("🚨 Format invalide. Utilisez un chiffre (20), une fourchette (20 < BB < 80), un max (BB < 60) ou un min (30 < BB).");
  }, 300); // ✅ Petit délai pour attendre la fin de la saisie
};


  return (
    <div className="selectors">

<div className="input-container">
 <label>Contexte :</label>
<select 
  value={rangeData.context} 
  onChange={(e) => setRangeData({ ...rangeData, context: e.target.value })}
>
  {CONTEXT_OPTIONS.map((ctx) => (
    <option key={ctx} value={ctx}>{ctx}</option>
  ))}
</select>
</div>

<div className="input-container">
      <label>Nom de la Range :</label>
      <input type="text" value={rangeData.rangeName} onChange={(e) => setRangeData({ ...rangeData, rangeName: e.target.value })} 
      placeholder="Nom de la Range"
      />
</div>

<div className="input-container">
<label>BB</label>
<input 
  type="text"
  value={rangeData.blinds}
  onChange={handleBlindsChange}
  placeholder="Ex: 15 < BB < 19 ou 20"
  className={`${isSubmitted && errors?.blinds ? "error" : ""}`}
/>
{isSubmitted && errors?.blinds && <p className="error-message">{errors.blinds}</p>}
</div>


<div className="input-container">
<label>Table :</label>
      <select 
        value={numSeats} 
        onChange={(e) => setNumSeats(Number(e.target.value))}
      >
        <option value="6">6 joueurs</option>
        <option value="8">8 joueurs</option>
        <option value="9">9 joueurs</option>
      </select>
      </div>

      <div className="input-container">     
      <label>Position du Héros :</label>
<select 
  value={rangeData.heroPosition} 
  onChange={(e) => setRangeData({ ...rangeData, heroPosition: e.target.value })}
  className={!rangeData.heroPosition ? "input-error" : ""}
>
  {POSITIONS_BY_SEATS[numSeats]?.map((pos) => (
    <option key={pos} value={pos}>{pos}</option>
  ))}
</select>
</div>

<div className="input-container">    
      <label>Spot :</label>
      <select value={rangeData.spot} onChange={(e) => setRangeData({ ...rangeData, spot: e.target.value })}>
        {["Open", "Single Action", "3bet", "Overcall & Squeeze"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      </div>

      <div className="input-container">
      <label>Position du Villain :</label>
<select 
  value={rangeData.villainPosition || "Aucun"} // ✅ Définit "Aucun" si aucune valeur
  onChange={(e) => setRangeData({ ...rangeData, villainPosition: e.target.value })}
>
  {["Aucun", ...POSITIONS_BY_SEATS[numSeats]
    .filter(pos => pos !== rangeData.heroPosition) // ✅ Exclure la position du héros
  ].map((pos) => (
    <option key={pos} value={pos}>{pos}</option>
  ))}
</select>
</div>

      </div>
  );
}

export default RangeSettings;
