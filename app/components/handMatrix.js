"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, saveRangeToFirebase, getDoc } from "@/lib/firebase"; 
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { doc } from "firebase/firestore";
import { combos } from "./../utils/combos";

// Actions et couleurs associées
const actions = {
  allin: "#c72727",
  "4bet": "#FF8000",
  "3bet": "#FFD700",
  raise: "#ea3b3b",
  call: "#5dd85d",
  fold: "#F5F5F5",
};

// Positions et blinds disponibles
const positions = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
const blindsOptions = [5, 20, 50, 100];

// Découpe la liste en lignes de 13
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

function HandMatrix({ rangeId }) {
  const [currentRangeId, setCurrentRangeId] = useState(rangeId || uuidv4());
  const [rangeName, setRangeName] = useState(""); 
  const [handColors, setHandColors] = useState({});
  const [selectedAction, setSelectedAction] = useState("fold");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [heroPosition, setHeroPosition] = useState("");
  const [spot, setSpot] = useState("");
  const [villainPosition, setVillainPosition] = useState("");
  const [blinds, setBlinds] = useState(20);

  useEffect(() => {
    const fetchRange = async () => {
      try {
        const docRef = doc(db, "ranges", currentRangeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("📄 Range chargée :", data);
          setRangeName(data.rangeName || "");
          setBlinds(data.blinds || 20);
          setHeroPosition(data.heroPosition || "");
          setSpot(data.spot || "");
          setVillainPosition(data.villainPosition || "");
          setHandColors(data.handColors || {});
        } else {
          console.warn("⚠️ Nouvelle range créée avec ID :", currentRangeId);
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      }
    };

    fetchRange();
  }, [currentRangeId]);

  // Sélectionne une main et met à jour Firebase
  const handleComboSelection = (combo) => {
    setHandColors((prev) => {
      const updatedColors = { ...prev, [combo]: selectedAction };
      saveRangeToFirebase(currentRangeId, rangeName, blinds, heroPosition, spot, villainPosition, updatedColors);
      return updatedColors;
    });
  };

  // Réinitialise la matrice
  const handleReset = async () => {
    setHandColors({}); // Reset en mémoire

    try {
      await saveRangeToFirebase(currentRangeId, rangeName, blinds, heroPosition, spot, villainPosition, {}); 
      console.log("🔄 Range réinitialisée !");
    } catch (error) {
      console.error("🚨 Erreur lors du reset :", error);
    }
  };

  return (
    <div>
      <div className="selectors">
        <div className="row">
          <label>Nom :</label>
          <input
            type="text"
            value={rangeName}
            onChange={(e) => setRangeName(e.target.value)}
            placeholder="Nom de la range"
            className="range-input"
          />
        </div>

        <div className="row">
          <label>BB :</label>
          <select value={blinds} onChange={(e) => setBlinds(Number(e.target.value))}>
            {blindsOptions.map((blind) => (
              <option key={blind} value={blind}>{blind} BB</option>
            ))}
          </select>

          <label>Héros :</label>
          <select value={heroPosition} onChange={(e) => setHeroPosition(e.target.value)}>
            {positions.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrice des actions */}
      <div className="actions">
  {Object.keys(actions).map((action) => (
    <button
      key={action}
      className={`action-btn ${selectedAction === action ? "selected" : ""}`}
      style={{ backgroundColor: actions[action] }}
      onClick={() => setSelectedAction(action)}
    >
      {action.toUpperCase()}
    </button>
  ))}

  {/* 🛠️ Bouton Reset placé ici, dans la même ligne */}
  <button
    className="action-btn reset-btn"
    style={{ backgroundColor: actions.reset }}
    onClick={handleReset}
  >
    RESET
  </button>
</div>

      {/* Matrice des mains 13x13 */}
      <div 
        className="hand-matrix"
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {chunk(combos, 13).map((row, rowIndex) => (
          <div key={rowIndex} className="hand-matrix-row">
            {row.map((combo) => (
              <div
                key={combo}
                className={`hand-matrix-cell`}
                style={{ backgroundColor: actions[handColors[combo]] || "#F5F5F5" }}
                data-combo={combo}
                onMouseDown={() => handleComboSelection(combo)}
                onMouseEnter={() => isMouseDown && handleComboSelection(combo)}
              >
                {combo}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

HandMatrix.propTypes = {
  rangeId: PropTypes.string,
};

export default HandMatrix;
