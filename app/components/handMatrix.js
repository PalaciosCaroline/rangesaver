"use client";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { db } from "@/lib/firebase";
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
  const [handColors, setHandColors] = useState({});
  const [selectedAction, setSelectedAction] = useState("fold");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const currentlyPointingAt = useRef(null);
  const positions = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
const [heroPosition, setHeroPosition] = useState(""); // On force l'utilisateur à choisir
const [situation, setSituation] = useState(""); // Choix de la situation après le héros
const [villainPosition, setVillainPosition] = useState(""); // Choix de l’adversaire si nécessaire
const blindsOptions = [5, 20, 50, 100];
const [blinds, setBlinds] = useState(20);


useEffect(() => {
  const loadRange = async () => {
    const docRef = doc(db, "ranges", rangeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setHandColors(data.handColors || {});
      setHeroPosition(data.heroPosition || ""); // Doit être choisi en premier
      setSituation(data.situation || ""); // Ne peut pas être défini avant le héros
      setVillainPosition(data.situation !== "Open" ? data.villainPosition || "" : ""); // Uniquement pour Vs Raise/Limp
      setBlinds(data.blinds || 20);
    }
  };
  loadRange();
}, [rangeId]);

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
      saveToFirebase(updatedColors);
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

  // Sauvegarde dans Firebase
  const saveToFirebase = async (updatedColors) => {
    if (!heroPosition) {
      alert("Veuillez choisir la position du héros.");
      return;
    }
  
    if (!situation) {
      alert("Veuillez choisir une situation.");
      return;
    }
  
    if ((situation === "Vs Raise" || situation === "Vs Limp") && !villainPosition) {
      alert("Veuillez choisir la position de l’adversaire.");
      return;
    }
  
    await setDoc(doc(db, "ranges", rangeId), {
      handColors: updatedColors,
      heroPosition,
      villainPosition: situation !== "Open" ? villainPosition : "",
      blinds,
      situation,
    }, { merge: true });
  };

  return (
    <div>
    <div className="selectors">
  {/* Sélection du héros */}
  <label>Héros : </label>
  <select
    value={heroPosition}
    onChange={(e) => {
      setHeroPosition(e.target.value);
      setSituation(""); // Réinitialise la situation après le changement du héros
      setVillainPosition(""); // Réinitialise le vilain si besoin
    }}
  >
    <option value="" disabled>Choisir une position</option>
    {positions.map((pos) => (
      <option key={pos} value={pos}>{pos}</option>
    ))}
  </select>

  {/* Sélection de la situation (uniquement si le héros est choisi) */}
  {heroPosition && (
    <>
      <label>Situation : </label>
      <select
        value={situation}
        onChange={(e) => {
          setSituation(e.target.value);
          if (e.target.value === "Open") {
            setVillainPosition(""); // Pas d’adversaire en Open
          } else {
            // Pré-remplit une valeur par défaut pour éviter d'avoir rien de sélectionné
            setVillainPosition(positions.find(pos => pos !== heroPosition) || "");
          }
        }}
      >
        <option value="" disabled>Choisir une situation</option>
        <option value="Open">Open</option>
        <option value="Vs Raise">Vs Raise</option>
        <option value="Vs Limp">Vs Limp</option>
      </select>
    </>
  )}

  {/* Sélection de l’adversaire si "Vs Raise" ou "Vs Limp" est sélectionné */}
  {heroPosition && (situation === "Vs Raise" || situation === "Vs Limp") && (
    <>
      <label>Adversaire : </label>
      <select
        value={villainPosition}
        onChange={(e) => setVillainPosition(e.target.value)}
      >
        {positions
          .filter(pos => pos !== heroPosition) // Exclut la position du héros
          .map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
      </select>
    </>
  )}

  {/* Sélection du nombre de blindes */}
  {heroPosition && (
    <>
      <label>BB : </label>
      <select value={blinds} onChange={(e) => setBlinds(Number(e.target.value))}>
        {blindsOptions.map((blind) => (
          <option key={blind} value={blind}>{blind} BB</option>
        ))}
      </select>
    </>
  )}
</div>

      {/* Boutons d'action */}
      <div className="actions">
  {Object.keys(actions).map((action) => (
    <button
      key={action}
      className={`action-btn ${selectedAction === action ? "selected" : ""}`}
      style={{
        backgroundColor: actions[action],
        border: selectedAction === action ? "1px solid black" : "1px solid gray",
        color: action === "fold" || action === "reset" ? "black" : "white",
        fontWeight: action === "reset" ? "bold" : "normal", 
      }}
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
  rangeId: PropTypes.string.isRequired,
};

export default HandMatrix;
