"use client";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { combos } from "./../utils/combos"; // ✅ Import des combinaisons

// Actions et couleurs associées
const actions = {
  fold: "#F5F5F5",
  allin: "firebrick",
  raise: "lightcoral",
  check: "green",
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

  // ✅ Empêche le scroll pendant le touch
  const disableScroll = () => {
    document.body.classList.add("lock-scroll");
  };

  const enableScroll = () => {
    document.body.classList.remove("lock-scroll");
  };

  // ✅ Fonction pour sélectionner une case
  const handleComboSelection = (combo) => {
    setHandColors((prev) => {
      const updatedColors = { ...prev, [combo]: selectedAction };
      saveToFirebase(updatedColors);
      return updatedColors;
    });
  };

  // ✅ Sélection par clic (desktop)
  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  // ✅ Sélection en glissant (desktop)
  const handleMouseEnter = (combo) => {
    if (isMouseDown) {
      handleComboSelection(combo);
    }
  };

  // ✅ Sélection en glissant (mobile)
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.combo) {
      handleComboSelection(element.dataset.combo);
    }
  };

  // ✅ Sauvegarde dans Firebase
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
              border: selectedAction === action ? "3px solid black" : "1px solid gray",
              color: action === "fold" ? "black" : "white",
            }}
            onClick={() => setSelectedAction(action)}
          >
            {action.toUpperCase()}
          </button>
        ))}

        {/* ✅ Bouton Réinitialiser */}
        <button
          className="action-btn reset-btn"
          onClick={() => setHandColors(combos.reduce((acc, combo) => ({ ...acc, [combo]: "fold" }), {}))}
          style={{ backgroundColor: "gray", color: "white" }}
        >
          RÉINITIALISER
        </button>
      </div>

      {/* Matrice des mains */}
      <div
        className="hand-matrix"
        onMouseDown={disableScroll} // ✅ Empêche le scroll lors du clic
        onMouseUp={() => {
          setIsMouseDown(false);
          enableScroll();
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
          enableScroll();
        }}
        onTouchStart={disableScroll} // ✅ Empêche le scroll lors du touch
        onTouchMove={handleTouchMove}
        onTouchEnd={enableScroll}
      >
        {chunk(combos, 13).map((row, rowIndex) => (
          <div key={rowIndex} className="hand-matrix-row">
            {row.map((combo) => (
              <div
                key={combo}
                className={`hand-matrix-cell ${getComboClassName(combo)}`}
                style={{
                  backgroundColor: actions[handColors[combo]] || "#F5F5F5",
                }}
                data-combo={combo}
                onMouseDown={() => handleMouseDown(combo)}
                onMouseEnter={() => handleMouseEnter(combo)}
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

// Fonction pour identifier les types de combinaisons (paires, suited, offsuit)
function getComboClassName(combo) {
  if (combo.length === 2) return "pair"; // ✅ Les paires ressortent visuellement
  if (combo.endsWith("s")) return "suited";
  return "offsuit";
}

HandMatrix.propTypes = {
  rangeId: PropTypes.string.isRequired,
};

export default HandMatrix;
