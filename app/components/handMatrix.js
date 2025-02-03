"use client";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { combos } from "./../utils/combos"; // ✅ Import des combinaisons depuis un fichier externe

// Actions et couleurs associées
const actions = {
  fold: "#F5F5F5", // ✅ Plus clair pour le "fold" normal
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
  const [selectedAction, setSelectedAction] = useState("fold"); // ✅ "Fold" par défaut
  const [isMouseDown, setIsMouseDown] = useState(false);
  const currentlyPointingAt = useRef(null);

  // Charger la range depuis Firebase
  useEffect(() => {
    const loadRange = async () => {
      const docRef = doc(db, "ranges", rangeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHandColors(docSnap.data().handColors || {});
      } else {
        // ✅ Initialiser toutes les cases en "fold"
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

  // ✅ Fonction pour sélectionner une case
  const handleComboSelection = (combo) => {
    setHandColors((prev) => {
      const updatedColors = { ...prev, [combo]: selectedAction };
      saveToFirebase(updatedColors);
      return updatedColors;
    });
  };

  // ✅ Début de la sélection (clic ou toucher)
  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  // ✅ Sélectionner en glissant sur desktop
  const handleMouseEnter = (combo) => {
    if (isMouseDown) {
      handleComboSelection(combo);
    }
  };

  // ✅ Sélectionner en glissant sur mobile (touch)
  const handleTouchMove = (e) => {
    const touch = e.touches[0]; // Récupère le premier doigt
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
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
        onTouchMove={handleTouchMove} // ✅ Ajout du support tactile
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
                data-combo={combo} // ✅ Ajout d'un dataset pour identifier les cases touchées
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
