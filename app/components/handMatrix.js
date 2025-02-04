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
    raise: "#ea3b3b",
    check: "#5dd85d",
    fold: "#F5F5F5", // Fold est maintenant placé après Check
    reset: "gray", // Ajout du bouton Réinitialiser dans le tableau
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

  useEffect(() => {
    const loadRange = async () => {
      const docRef = doc(db, "ranges", rangeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHandColors(docSnap.data().handColors || {});
      } else {
        setHandColors(
          combos.reduce((acc, combo) => {
            acc[combo] = "fold";
            return acc;
          }, {})
        );
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
    await setDoc(doc(db, "ranges", rangeId), { handColors: updatedColors }, { merge: true });
  };

  return (
    <div>
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
