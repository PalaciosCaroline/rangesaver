"use client";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { combos } from "./../utils/combos";

// Actions disponibles et couleurs associées
const actions = {
  fold: "#F5F5F5", 
  allin: "firebrick",
  raise: "lightcoral",
  check: "green",
};

// Fonction pour découper la liste en ligne de 13 colonnes
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

function HandMatrix({ rangeId }) {
  const [handColors, setHandColors] = useState({});
  const [selectedAction, setSelectedAction] = useState("fold"); // "Fold" par défaut
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
        resetRange(); //  Initialiser si aucune donnée existante
      }
    };
    loadRange();
  }, [rangeId]);

  const handleComboSelection = (combo) => {
    setHandColors((prev) => {
      const updatedColors = { ...prev, [combo]: selectedAction };
      saveToFirebase(updatedColors);
      return updatedColors;
    });
  };

  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  const handleMouseEnter = (combo) => {
    if (isMouseDown) {
      handleComboSelection(combo);
    }
  };

  const saveToFirebase = async (updatedColors) => {
    await setDoc(doc(db, "ranges", rangeId), { handColors: updatedColors }, { merge: true });
  };

  // ✅ Fonction pour réinitialiser toute la range
  const resetRange = async () => {
    const initialColors = combos.reduce((acc, combo) => {
      acc[combo] = "fold"; // Tout en "fold" au départ
      return acc;
    }, {});

    setHandColors(initialColors); // Mise à jour du state
    await saveToFirebase(initialColors); // Enregistrement Firebase
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
              boxShadow: selectedAction === action ? "0px 0px 8px rgba(0, 0, 0, 0.5)" : "none",
            }}
            onClick={() => setSelectedAction(action)}
          >
            {action.toUpperCase()}
          </button>
        ))}

        {/* Bouton Réinitialiser */}
        <button
          className="action-btn reset-btn"
          onClick={resetRange}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "2px solid black",
            padding: "8px",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          RÉINITIALISER
        </button>
      </div>

      {/* Matrice des mains */}
      <div
        className="hand-matrix"
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
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

// Fonction pour appliquer les classes CSS correctes
function getComboClassName(combo) {
  if (combo.length === 2) return "pair"; // Les paires ressortent
  if (combo.endsWith("s")) return "suited";
  return "offsuit";
}

HandMatrix.propTypes = {
  rangeId: PropTypes.string.isRequired,
};

export default HandMatrix;
