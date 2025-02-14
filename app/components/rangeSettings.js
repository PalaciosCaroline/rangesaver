//components/rangeSettings;
import React, { useState, useEffect } from "react";
import DropdownSelect from "./dropdownSelect";
import { POSITIONS_BY_SEATS } from "@/data/positions";
import { VILLAIN_POSITIONS_BY_SEATS } from "@/data/positions";
import { CONTEXT_OPTIONS } from "@/data/positions";
import "./../styles/rangeSettings.css";

function RangeSettings({ rangeData, setRangeData, setErrors,isSubmitted, validateBlinds}) {
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
  
  const handleBlindsChange = (e) => {
    let value = e.target.value.trim();
    setRangeData((prev) => ({ ...prev, blinds: value }));

    // ✅ Met à jour les erreurs en direct si le formulaire a déjà été soumis
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, blinds: validateBlinds(value) }));
    }
  };



  return (
    <div className="selectors">

      <DropdownSelect
        label="Contexte"
        options={CONTEXT_OPTIONS}
        value={rangeData.context}
        onChange={(selected) => setRangeData({ ...rangeData, context: selected })}
      />


<div className="input-containerBlinds">
  <label>BB</label>
  <div className="input-group">
    <input 
      type="text"
      value={rangeData.blinds}
      onChange={handleBlindsChange}
      placeholder="Ex: 15 < BB < 19 ou 20"
      className={`${isSubmitted && errors?.blinds ? "error" : ""}`}
      />
      {isSubmitted && errors?.blinds && (
        <p className="error-message">{errors.blinds}</p>
      )}
  </div>
</div>

  
<DropdownSelect
  label="Table"
  options={[6, 8, 9]} // Pour la table
  value={numSeats}
  onChange={setNumSeats}
/>


<DropdownSelect
  label="Position"
  options={POSITIONS_BY_SEATS[numSeats]}
  value={rangeData.heroPosition}
  onChange={(selected) => setRangeData({ ...rangeData, heroPosition: selected })}
/>


<DropdownSelect
    label="Spot"
    options={["Open", "Single Action", "3bet", "Overcall & Squeeze"]}
    value={rangeData.spot}
    onChange={(selected) => setRangeData({ ...rangeData, spot: selected })}
    placeholder="Sélectionnez un spot"
  />

  <DropdownSelect
    label="Villain"
    options={["Aucun", ...POSITIONS_BY_SEATS[numSeats].filter(pos => pos !== rangeData.heroPosition)]} // ✅ Exclut la position du héros
    value={rangeData.villainPosition || "Aucun"} // ✅ "Aucun" si aucune valeur sélectionnée
    onChange={(selected) => setRangeData({ ...rangeData, villainPosition: selected })}
    placeholder="Sélectionnez la position du villain"
  />


<div className="input-containerDescription">
      <label>Description</label>
      <input type="text" value={rangeData.rangeName} onChange={(e) => setRangeData({ ...rangeData, rangeName: e.target.value })} 
      placeholder="Description de la Range"
      />
</div>

      </div>
  );
}

export default RangeSettings;
