"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {db, saveRangeToFirebase } from "@/lib/firebase"; 
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { combos } from "./../utils/combos"; // Import des combinaisons


// Actions et couleurs associées
const actions = {
  allin: "#c72727",
  "4bet": "#FF8000",
  "3bet": "#FFD700",
  raise: "#ea3b3b",
  call: "#5dd85d",
  fold: "#F5F5F5",
  reset: "gray",
};


// Fonction pour découper la liste en lignes de 13 colonnes
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

function HandMatrix({ rangeId }) {
  const [currentRangeId, setCurrentRangeId] = useState(rangeId);
  const [rangeName, setRangeName] = useState(""); 
  const [handColors, setHandColors] = useState({});
  const [selectedAction, setSelectedAction] = useState("fold");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const currentlyPointingAt = useRef(null);
  const positions = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
const [heroPosition, setHeroPosition] = useState(""); // On force l'utilisateur à choisir
const [spot, setSpot] = useState(""); // Choix de la situation après le héros
const [villainPosition, setVillainPosition] = useState(""); // Choix de l’adversaire si nécessaire
const blindsOptions = [5, 20, 50, 100];
const [blinds, setBlinds] = useState(20);

useEffect(() => {
  const initializeRange = async () => {
    if (!currentRangeId) {
      const newRangeId = uuidv4();
      setCurrentRangeId(newRangeId); // Met à jour le state avec le nouvel ID
      console.log("🆕 Nouvelle range créée avec ID :", newRangeId);

      try {
        if (!handColors || Object.keys(handColors).length === 0) {
          console.warn("⚠️ Aucune main sélectionnée. Initialisation de handColors.");
        }
        await setDoc(doc(db, "ranges", newRangeId), {
          rangeName: "Nouvelle range",
          createdAt: new Date(),
          blinds: 20,
          heroPosition: "",
          spot: "",
          villainPosition: "",
          handColors: {}
        });
      } catch (error) {
        console.error("🚨 Erreur lors de la création de la range :", error);
      }
    } else {
      try {
        // Charger la range existante
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
          console.warn("⚠️ Range introuvable, création d'une nouvelle.");
          setCurrentRangeId(null); // Force la création d'une nouvelle range
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      }
    }
  };

  initializeRange();
}, [currentRangeId]);

  // Désactive le scroll pendant la sélection
  const disableScroll = () => {
    document.body.classList.add("lock-scroll");
  };

  const enableScroll = () => {
    document.body.classList.remove("lock-scroll");
  };


  // Sélection d'une case
  const handleComboSelection = (combo) => {
    setHandColors((prev) => {
      const updatedColors = { ...prev, [combo]: selectedAction };
      saveRangeToFirebase(rangeId, blinds, heroPosition, spot, villainPosition, updatedColors);
      return updatedColors;
    });
  };

  // Sélection par clic (desktop)
  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  // Sélection en glissant (desktop)
  const handleMouseEnter = (combo) => {
    if (isMouseDown) {
      handleComboSelection(combo);
    }
  };

  // Sélection en glissant (mobile)
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.combo) {
      handleComboSelection(element.dataset.combo);
    }
  };

  
  return (
    <div>
<div className="selectors">
  {/* 📌 Champ pour nommer la range */}
  <div className="row">
    <div className="selector-group">
      <label>Nom :</label>
      <input
        type="text"
        value={rangeName}
        onChange={(e) => setRangeName(e.target.value)}
        placeholder="Nom de la range"
        className="range-input"
      />
    </div>
  </div>

  {/* 📌 Première ligne : BB + HÉROS alignés sur la même ligne */}
  <div className="row">
    <div className="selector-group">
      <label>BB :</label>
      <select value={blinds} onChange={(e) => setBlinds(Number(e.target.value))}>
        {blindsOptions.map((blind) => (
          <option key={blind} value={blind}>{blind} BB</option>
        ))}
      </select>
    </div>

    <div className="selector-group">
      <label>Héros :</label>
      <select value={heroPosition} onChange={(e) => setHeroPosition(e.target.value)}>
        {positions.map((pos) => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
    </div>
  </div>

  {/* 📌 Deuxième ligne : SITUATION + ADVERSAIRE alignés sur la même ligne */}
  <div className="row">
    <div className="selector-group">
      <label>Spot :</label>
      <select
        value={spot}
        onChange={(e) => {
          setSituation(e.target.value);
          if (e.target.value === "Open") {
            setVillainPosition(""); // Réinitialisation de l’adversaire si Open
          } else {
            setVillainPosition(positions.find(pos => pos !== heroPosition) || "");
          }
        }}
      >
        <option value="Open">Open</option>
        <option value="Vs Raise">Vs Raise</option>
        <option value="Vs Limp">Vs Limp</option>
      </select>
    </div>

    {/* 📌 Affichage du choix de l’adversaire seulement si Vs Raise ou Vs Limp */}
    {spot !== "Open" && (
      <div className="selector-group">
        <label>Villain :</label>
        <select value={villainPosition} onChange={(e) => setVillainPosition(e.target.value)}>
          {positions.filter(pos => pos !== heroPosition).map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>
    )}
  </div>
</div>

  

      {/* Boutons d'action */}
  
      <div className="actions">
  {/* Boutons principaux (All-in, 3bet, 4bet, Raise) */}
  {["allin", "4bet", "3bet", "raise"].map((action) => (
    <button
      key={action}
      className={`action-btn ${selectedAction === action ? "selected" : ""}`}
      style={{ backgroundColor: actions[action] }}
      onClick={() => setSelectedAction(action)}
    >
      {action.toUpperCase()}
    </button>
  ))}

  {/* Groupe des boutons Call, Fold et Reset alignés sur une seule ligne */}
  <div className="action-group">
    {["call", "fold", "reset"].map((action) => (
      <button
        key={action}
        className={`action-btn ${selectedAction === action ? "selected" : ""}`}
        style={{ backgroundColor: actions[action] }}
        onClick={() => {
          if (action === "reset") {
            setHandColors(combos.reduce((acc, combo) => ({ ...acc, [combo]: "fold" }), {}));
          } else {
            setSelectedAction(action);
          }
        }}
      >
        {action.toUpperCase()}
      </button>
    ))}
  </div>
</div>

      {/* Matrice des mains */}
      <div
        className="hand-matrix"
        onMouseDown={disableScroll}
        onMouseUp={() => {
          setIsMouseDown(false);
          enableScroll();
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
          enableScroll();
        }}
        onTouchStart={disableScroll}
        onTouchMove={handleTouchMove}
        onTouchEnd={enableScroll}
      >
        {chunk(combos, 13).map((row, rowIndex) => (
          <div key={rowIndex} className="hand-matrix-row">
            {row.map((combo) => {
              const comboClass = getComboClassName(combo);
              return (
                <div
                  key={combo}
                  className={`hand-matrix-cell ${comboClass}`}
                  style={{
                    backgroundColor: actions[handColors[combo]] || "#F5F5F5",
                  }}
                  data-combo={combo}
                  onMouseDown={() => handleMouseDown(combo)}
                  onMouseEnter={() => handleMouseEnter(combo)}
                >
                  <div>{combo}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button
  className="save-btn"
  onClick={() => saveRangeToFirebase(
    currentRangeId,  // ID généré ou existant
    rangeName,       // Nom de la range
    blinds,          // Blinds sélectionnées
    heroPosition,    // Position du héros
    spot,            // Situation (Open, Vs Raise...)
    villainPosition, // Position de l'adversaire
    handColors       // Actions enregistrées sur la matrice
  )}
>
  Enregistrer la Range
</button>
    </div>
  );
}

// Détermine la classe en fonction du type de main
function getComboClassName(combo) {
  if (combo.length === 2) return "pair";
  if (combo.endsWith("s")) return "suited";
  return "offsuit";
}


HandMatrix.propTypes = {
  rangeId: PropTypes.string,
};

export default HandMatrix;
